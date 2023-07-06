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
    func getElaspedTime(completion: @escaping (Double) -> Void) {
        guard let currentUser = Auth.auth().currentUser else {
            completion(-1)
            return
        }
        
        let db = Firestore.firestore()
        let sessionsCollection = db.collection("sessions")
        let uid = currentUser.uid

        sessionsCollection.whereField("userId", isEqualTo: uid).getDocuments { (querySnapshot, error) in
            if let error = error {
                print("Error getting sessions: \(error)")
                completion(-1)
                return
            }

            guard let documents = querySnapshot?.documents else {
                print("No sessions found for the current user.")
                completion(-1)
                return
            }

            for document in documents {
                let sessionData = document.data()
                if let startingTime = sessionData["date"] as? Double {
                    let elapsedTime = Date().timeIntervalSince1970 - startingTime
                    completion(elapsedTime)
                    return
                } else {
                    print("Invalid date format for session.")
                    completion(-1)
                    return
                }
            }
        }
    }

    
    
    
    /// Delete to do list item
    /// - Parameter id: item id to delete
    
}
