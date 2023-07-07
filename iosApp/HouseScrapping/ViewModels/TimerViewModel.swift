//
//  TestViewModel.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-07-04.
//

import Foundation
import FirebaseAuth
import FirebaseFirestore

class TimerViewModel: ObservableObject {
    
    init(){}
    func stopSession(){
        
        // Create model
        
        guard let uid = Auth.auth().currentUser?.uid else{
            return
        }
        
        let db = Firestore.firestore()
        
        // first clean up the db
        db.collection("sessions")
            .whereField("userId", isEqualTo: uid)
            .getDocuments { (querySnapshot, error) in
                if let error = error {
                    print("Error getting sessions: \(error)")
                    return
                }

                guard let documents = querySnapshot?.documents else {
                    print("No sessions found for the current user.")
                    return
                }

                for document in documents {
                    db.collection("sessions").document(document.documentID).delete { error in
                        if let error = error {
                            print("Error deleting session: \(error)")
                        } else{
                            print("Deletion Succeed")
                        }
                    }
                }
            }
    }
    


    
    
    
    /// Delete to do list item
    /// - Parameter id: item id to delete
    
}
