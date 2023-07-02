//
//  testViewModel.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-06-29.
//

import Foundation
import UIKit
import SwiftUI

struct ImagePicker: UIViewControllerRepresentable{
    @Binding var selectedImage: UIImage?
    @Binding var isPickerShowing: Bool
    func makeUIViewController(context: Context) -> some UIViewController {
        let imagePicker = UIImagePickerController()
        imagePicker.sourceType = .photoLibrary
        imagePicker.delegate = context.coordinator
        return imagePicker
    }
    func updateUIViewController(_ uiViewController: UIViewControllerType, context: Context) {
        
    }
    
    func makeCoordinator() -> Coordinator {
        return Coordinator(self)
    }
}

class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    var parent: ImagePicker
    
    init(_ picker: ImagePicker){
        self.parent = picker
    }
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        // Run the code when the user has selected the image
        
        if let image = info[UIImagePickerController.InfoKey.originalImage] as?
            UIImage{
            DispatchQueue.main.async {
                self.parent.selectedImage = image
            }
        }
        // Dismiss the controller
        parent.isPickerShowing = false
    }
   
    
    
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        // Run code when the user has cancelled the Picker UI
        
        // Dismiss the controller
        parent.isPickerShowing = false
    }
}
