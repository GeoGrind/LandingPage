//
//  TestView.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-06-29.
//

import SwiftUI

struct TestView: View {
    @State var isPickerShowing = false
    @State var selectedImage: UIImage?
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
            
        }
        .sheet(isPresented: $isPickerShowing, onDismiss: nil){
            // Image picker
            ImagePicker(selectedImage: $selectedImage, isPickerShowing: $isPickerShowing)
        }
        
    }
}

struct TestView_Previews: PreviewProvider {
    static var previews: some View {
        TestView()
    }
}
