//
//  TestView.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-06-29.
//

import SwiftUI
import FirebaseStorage
import FirebaseFirestore
import FirebaseAuth

struct ProfilePicView: View {
    
    @State var isPickerShowing = false
    @State var selectedImage: UIImage?
    @State private var showSuccessAlert = false
    @State private var showFailureAlert = false
    init(){
        retrievePhotos()
    }
    var body: some View {
        
        VStack {
            if let image = selectedImage {
                Image(uiImage: image)
                    .resizable()
                    .frame(width: 200, height: 200)
            } else{
                Image(systemName: "person.fill")
                    .resizable()
                    .frame(width: 200, height: 200)
            }
            Button{
                isPickerShowing = true
            } label: {
                Text("Select a photo")  
            }
            // Upload button
            if selectedImage != nil {
                Button {
                    uploadPhoto()
                } label: {
                    Text("Upload photo")
                }
            }
            Divider()
                
        }
        .sheet(isPresented: $isPickerShowing, onDismiss: nil){
            // Image picker
            ImagePicker(selectedImage: $selectedImage, isPickerShowing: $isPickerShowing)
        }
        .onAppear{
            retrievePhotos()
        }
        
        .alert(isPresented: $showSuccessAlert) {
                    Alert(title: Text("Success"), message: Text("Photo uploaded successfully"), dismissButton: .default(Text("OK")))
        }
        .alert(isPresented: $showFailureAlert) {
                    Alert(title: Text("Upload Failed"), message: Text("There are some technical issues!"), dismissButton: .default(Text("OK")))
        }
        
    }
    func uploadPhoto(){
        // Make sure that the selected image property is not nil
        guard selectedImage != nil else{
            return
        }
        // Storage ref
        let storage = Storage.storage()
        // Create storage reference
        let storageRef = Storage.storage().reference()
        // Turn our image into data
        let imageData = selectedImage!.jpegData(compressionQuality: 0.8)
        
        // Check that we are able to convert it to data
        guard imageData != nil else{
            return
        }
        // Specify the file path and name
        
        let path = "\(UUID().uuidString).jpeg"
        let fileRef = storageRef.child(path)
        let db = Firestore.firestore()
        guard let uid = Auth.auth().currentUser?.uid else{
            showFailureAlert = true
            return
        }
        let currentUserDocRef = db.collection("users").document(uid)
        currentUserDocRef.getDocument { (document, error) in
            if let document = document, document.exists {
                // Check if the "imageData" field exists
                if document.data()?["imageData"] != nil {
                    
                    
                    if let imagePath = document.data()?["imageData"] as? String {
                        let storageRef = storage.reference().child(imagePath)
                        // Delete the storage item
                        storageRef.delete { error in
                            if error != nil {
                                showFailureAlert = true
        
                            } else {
                                print("Storage item deleted successfully!")
                            }
                        }
                    }
                }
            }
        }
        // Upload that data
        _ = fileRef.putData(imageData!, metadata: nil) { metadata, error in
            // Check for err
            if error == nil && metadata != nil{
                // Save a reference to firestore database
                
                let imageDataField = ["imageData": path]

                currentUserDocRef.setData(imageDataField, merge: true) { error in
                    if error != nil {
                        showFailureAlert = true
                    } else {
                        print("imageData field added successfully!")
                    }
                }
            } else {
                showFailureAlert = true
            }
        }
        // Save a reference to the data in firebase db
        showSuccessAlert = true
    }
    func retrievePhotos(){
        
        let db = Firestore.firestore()
        guard let uid = Auth.auth().currentUser?.uid else{
            return
        }
        let currentUserDocRef = db.collection("users").document(uid)
        currentUserDocRef.getDocument { snapshot, error in
            if error == nil && snapshot != nil{
                guard let document = snapshot else {
                        print("Document does not exist")
                        return
                    }
                if let imageURL = document.data()?["imageData"] as? String {
                        // Access the imageURL field
                        
                        let storageRef = Storage.storage().reference()
                        let fileRef = storageRef.child(imageURL)
                        fileRef.getData(maxSize: 5 * 1024 * 1024) { data, error in
                            if error == nil && data != nil {
                                if let image = UIImage(data: data!){
                                    self.selectedImage = image
                                }
                            }
                                            
                        }
                    } else {
                        print("Image URL field does not exist or is not a string")
                        return
                    }
            }
        }
        
    }
}


struct ProfilePic_Previews: PreviewProvider {
    static var previews: some View {
        ProfilePicView()
    }
}
