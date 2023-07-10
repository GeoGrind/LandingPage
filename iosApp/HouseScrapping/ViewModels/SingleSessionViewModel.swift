//
//  AllSessionViewModel.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-07-07.
//

import Foundation
import FirebaseAuth
import FirebaseFirestore

class SingleSessionViewModel: ObservableObject {
    private var userListener: ListenerRegistration?
    @Published var isSubscribing = false

    func listenToUserSubscriptionStatus(userId: String) {
        let db = Firestore.firestore()
        let userRef = db.collection("users").document(userId)

        userListener = userRef.addSnapshotListener { [weak self] snapshot, error in
            guard let self = self else { return }
            
            if let error = error {
                print("Error listening to user: \(error)")
                return
            }
            
            guard let document = snapshot, document.exists else {
                print("User document does not exist")
                return
            }
            
            let userData = document.data()
            self.isSubscribing = userData?["isSubscribing"] as? Bool ?? false
        }
    }
    
    func addSubscriberToCurrentSession(sessionID: String) {
        guard let userId = Auth.auth().currentUser?.uid else {
            return
        }
        
        let db = Firestore.firestore()
        let sessionRef = db.collection("sessions").document(sessionID)
        
        // Update session's "subscribers" field
        sessionRef.updateData([
            "subscribers": FieldValue.arrayUnion([userId])
        ]) { error in
            if let error = error {
                print("Error adding subscriber to session: \(error)")
            } else {
                print("Subscriber added successfully")
                // Update user's "isSubscribing" field
                let userRef = db.collection("users").document(userId)
                userRef.updateData([
                    "isSubscribing": true
                ]) { error in
                    if let error = error {
                        print("Error updating user's isSubscribing field: \(error)")
                    } else {
                        print("User's isSubscribing field updated successfully")
                    }
                }
            }
        }
    }

}
