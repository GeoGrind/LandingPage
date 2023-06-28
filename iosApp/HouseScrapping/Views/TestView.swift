//
//  testView.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-06-27.
//

import PhotosUI
import SwiftUI

struct TestView: View {
    @State var selectedItems: [PhotosPickerItem] = []
    @State var data: Data?
    
    var body: some View {
        VStack{
            if let data = data, let uiimage = UIImage(data: data){
                Image(uiImage: uiimage)
                    .resizable()
            }
            Spacer()
            PhotosPicker(
                selection: $selectedItems,
                matching: .images
            ){
                Text("Pick photos")
            }
        }
    }
}

struct testView_Previews: PreviewProvider {
    static var previews: some View {
        TestView()
    }
}
