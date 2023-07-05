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
    
    func getStartTime(){
        guard let currentUser = Auth.auth().currentUser else {
            // No authenticated user found
            return
        }
        
        let db = Firestore.firestore()
        let sessionsCollection = db.collection("sessions")
        let uid = currentUser.uid

        sessionsCollection.whereField("userId", isEqualTo: uid).getDocuments { (querySnapshot, error) in
            if let error = error {
                print("Error getting sessions: \(error)")
                return
            }

            guard let documents = querySnapshot?.documents else {
                print("No sessions found for the current user.")
                return
            }

            for document in documents {
                let sessionData = document.data()
                if let startingTime = sessionData["date"] as? Double {
                    print("Session time (1970): \(Date().timeIntervalSince1970-startingTime)")
                } else {
                    print("Invalid date format for session.")
                }
            }
        }
    }
    
    
    
    /// Delete to do list item
    /// - Parameter id: item id to delete
    
}
