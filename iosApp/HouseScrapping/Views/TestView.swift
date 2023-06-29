//
//  testView.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-06-27.
//

import PhotosUI
import SwiftUI
import FirebaseFirestore
import FirebaseAuth
let databaseReference = Firestore.firestore().collection("users")

struct TestView: View {
    @State var selectedItems: [PhotosPickerItem] = []
    @State var data: Data?
    
    var body: some View {
        VStack{
            if let data = self.data, let uiimage = UIImage(data: data){
                Image(uiImage: uiimage)
                    .resizable()
            }
            
            Spacer()
            PhotosPicker(
                selection: $selectedItems,
                maxSelectionCount: 1,
                matching: .images
            ){
                Text("Pick photos")
            }
            .onChange(of: selectedItems){ newValue in
                guard let item = selectedItems.first else {
                    return
                }
            
                item.loadTransferable(type: Data.self){ result in
                    switch result {
                    case .success(let data):
                        if let data = data {
                            self.data = data
                            
                        } else {
                            print("Data is nil")
                        }
                    
                    case .failure(let failure):
                        fatalError("\(failure)")
                    }
                }
            }
        }
    }
}

struct testView_Previews: PreviewProvider {
    static var previews: some View {
        TestView()
    }
}
