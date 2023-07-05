//
//  TestViewModel.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-07-03.
//



import Foundation
import FirebaseAuth
import FirebaseFirestore

class NewSessionViewModel: ObservableObject {
    
   
    init(){}
    
    func save(course: String, location: String){
        
        // Create model
        let newId = UUID().uuidString
        guard let uid = Auth.auth().currentUser?.uid else{
            return
        }
        let newSession = Session(
            id: newId,
            userId: uid,
            course: course,
            location: location,
            date: Date().timeIntervalSince1970
        )
        
        
        // Save model
        let db = Firestore.firestore()
        db.collection("sessions")
            .document(newId)
            .setData(newSession.asDictionary()) { error in
                if let error = error {
                    print("Error saving session: \(error)")
                } else {
                    print("Session saved successfully!")
                }
            }
    
    }
    /// Delete to do list item
    /// - Parameter id: item id to delete
    
}
