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
    
    func saveSession(course: String, location: String, completion: @escaping (Double) -> Void) {
        // Create model
        let newId = UUID().uuidString
        guard let uid = Auth.auth().currentUser?.uid else {
            completion(-1) // Return failure if uid is not available
            return
        }
        
        let startTime = Date().timeIntervalSince1970
        let newSession = Session(
            id: newId,
            userId: uid,
            course: course,
            location: location,
            date: startTime
        )
        
        // Save model
        let db = Firestore.firestore()
        
        // First clean up the db
        db.collection("sessions")
            .whereField("userId", isEqualTo: uid)
            .getDocuments { (querySnapshot, error) in
                if let error = error {
                    print("Error getting sessions: \(error)")
                    completion(-1) // Return failure if there's an error
                    return
                }
                
                guard let documents = querySnapshot?.documents else {
                    print("No sessions found for the current user.")
                    completion(-1) // Return failure if no documents found
                    return
                }
                
                // The case when the current user does not have a session running
                if documents.count == 0 {
                    db.collection("sessions").addDocument(data: newSession.asDictionary()) { error in
                        if let error = error {
                            print("Error adding new session: \(error)")
                            completion(-1) // Return failure if there's an error
                        } else {
                            print("New session added successfully.")
                            completion(startTime) // Return success
                        }
                    }
                } else {
                    let document = documents[0]
                    db.collection("sessions").document(document.documentID).delete { error in
                        if let error = error {
                            print("Error deleting session: \(error)")
                            completion(-1) // Return failure if there's an error
                        } else {
                            db.collection("sessions").addDocument(data: newSession.asDictionary()) { error in
                                if let error = error {
                                    print("Error adding new session: \(error)")
                                    completion(-1) // Return failure if there's an error
                                } else {
                                    db.collection("users").document(uid).updateData([
                                        "startTime": startTime
                                    ]) { error in
                                        if let error = error {
                                            print("Error updating user document: \(error)")
                                            completion(-1) // Return failure if there's an error
                                        } else {
                                            print("User document updated successfully.")
                                            completion(startTime) // Return success
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
    }

    /// Delete to do list item
    /// - Parameter id: item id to delete
    
}
