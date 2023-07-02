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

struct TestView: View {
    
    @State var isPickerShowing = false
    @State var selectedImage: UIImage?
    init(){
        retrievePhotos()
    }
    var body: some View {
        
        VStack {
            if selectedImage != nil{
                Image(uiImage: selectedImage!)
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
            return
        }
        let currentUserDocRef = db.collection("users").document(uid)
        currentUserDocRef.getDocument { (document, error) in
            if let document = document, document.exists {
                // Check if the "imageData" field exists
                if document.data()?["imageData"] != nil {
                    print("The user has the 'imageData' field.")
                    
                    if let imagePath = document.data()?["imageData"] as? String {
                        let storageRef = storage.reference().child(imagePath)
                        // Delete the storage item
                        storageRef.delete { error in
                            if let error = error {
                                print("Error deleting storage item: \(error)")
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
                    if let error = error {
                        print("Error updating imageData field: \(error)")
                    } else {
                        print("imageData field added successfully!")
                    }
                }
                
            }
        }
        // Save a reference to the data in firebase db
    }
    func retrievePhotos() {
        
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
                    }
            }
        }
        
//        db.collection("images").getDocuments{ snapshot, error in
//            if error == nil && snapshot != nil{
//                var paths = [String]()
//                for doc in snapshot!.documents {
//                    // extract the file path
//                    paths.append(doc["url"] as! String )
//                }
//                for path in paths {
//                    let storageRef = Storage.storage().reference()
//                    let fileRef = storageRef.child(path)
//                    fileRef.getData(maxSize: 5 * 1024 * 1024) { data, error in
//                        if error == nil && data != nil {
//                            if let image = UIImage(data: data!){
//                                DispatchQueue.main.async {
//                                    retrivedImages.append(image)
//                                }
//                            }
//                        }
//                    }
//                }
//            }
//        }
    }
}


struct TestView_Previews: PreviewProvider {
    static var previews: some View {
        TestView()
    }
}
