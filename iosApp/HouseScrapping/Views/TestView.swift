//
//  TestView.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-06-29.
//

import SwiftUI
import FirebaseStorage
import FirebaseFirestore
struct TestView: View {
     
    @State var isPickerShowing = false
    @State var selectedImage: UIImage?
    @State var retrivedImages = [UIImage]()
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
            
            HStack {
                // Loop through the images 
                ForEach(retrivedImages, id: \.self){ image in
                    Image(uiImage: image)
                        .resizable()
                        .frame(width: 200, height: 200)
                }
            }
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
        // Create storage reference
        let storageRef = Storage.storage().reference()
        // Turn our image into data
        let imageData = selectedImage!.jpegData(compressionQuality: 0.8)
        
        // Check that we are able to convert it to data
        guard imageData != nil else{
            return
        }
        // Specify the file path and name
        let path = "images/\(UUID().uuidString).jpeg"
        let fileRef = storageRef.child(path)
        // Upload that data
        let uploadTask = fileRef.putData(imageData!, metadata: nil) { metadata, error in
            // Check for err
            if error == nil && metadata != nil{
                // Save a reference to firestore database
                let db = Firestore.firestore()
                db.collection("images").document().setData(["url": path]){ error in
                    if error == nil{
                        DispatchQueue.main.async{
                            self.retrivedImages.append(self.selectedImage!)
                        }
                        
                    }
                }
            }
        }
        // Save a reference to the data in firebase db
    }
    func retrievePhotos(){
        let db = Firestore.firestore()
        db.collection("images").getDocuments{ snapshot, error in
            if error == nil && snapshot != nil{
                var paths = [String]()
                for doc in snapshot!.documents {
                    // extract the file path
                    paths.append(doc["url"] as! String )
                }
                for path in paths {
                    let storageRef = Storage.storage().reference()
                    let fileRef = storageRef.child(path)
                    fileRef.getData(maxSize: 5 * 1024 * 1024) { data, error in
                        if error == nil && data != nil {
                            if let image = UIImage(data: data!){
                                DispatchQueue.main.async {
                                    retrivedImages.append(image)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


struct TestView_Previews: PreviewProvider {
    static var previews: some View {
        TestView()
    }
}
