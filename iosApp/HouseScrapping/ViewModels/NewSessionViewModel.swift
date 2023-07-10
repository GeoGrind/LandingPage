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
    func cleanUpSession(document: DocumentSnapshot, completion: @escaping () -> Void) {
        let db = Firestore.firestore()
        guard let subscribers = document.data()?["subscribers"] as? [String] else {
            // No subscribers found, skip the cleanup
            completion()
            return
        }
        
        let dispatchGroup = DispatchGroup()
        
        for userId in subscribers {
            dispatchGroup.enter()
            
            // Update the user document
            let userRef = db.collection("users").document(userId)
            userRef.updateData([
                "isSubscribing": false,
                "subscribingSession": ""
            ]) { error in
                if let error = error {
                    print("Failed to update user document for user ID \(userId): \(error)")
                }
                
            dispatchGroup.leave()
            }
        }
        
        dispatchGroup.notify(queue: .main) {
            completion()
        }
    }

    

    // Delete the session for the current user, return 1 if deletion succeed, 0 otherwise
    func deleteSession(completion: @escaping (Double) -> Void){
        // Create model
        
        guard let uid = Auth.auth().currentUser?.uid else {
            completion(-1) // Return failure if uid is not available
            return
        }
        
        let db = Firestore.firestore()
        
        // First clean up the db
        db.collection("sessions")
            .whereField("ownerId", isEqualTo: uid)
            .getDocuments { (querySnapshot, error) in
                if error != nil {
                    completion(0) // Return failure if there's an error
                    return
                }
                
                // error checking
                guard let documents = querySnapshot?.documents else {
                    completion(0)
                    return
                }
                
                // The case when the current user does not have a session running, no need for deletion, returns 1 immediately
                if documents.count == 0 {
                    completion(1)
                    return
                } else {
                    let document = documents[0]
                    
                    self.cleanUpSession(document: document) {
                        db.collection("sessions").document(document.documentID).delete { error in
                            if let error = error {
                                print("Failed to delete session document: \(error)")
                                completion(0) // Return failure if there's an error
                            } else {
                                // remove the startTime field in the user
                                db.collection("users")
                                    .document(uid)
                                    .updateData([
                                        "startTime": FieldValue.delete()
                                    ]) { error in
                                        if let error = error {
                                            print("Failed to update user document: \(error)")
                                            completion(0)
                                        } else {
                                            completion(1)
                                        }
                                    }
                            }
                        }
                    }
                }
            }
    }
        // Create a new session document, also store the session starting time as a field in user. Returns the session startingTime if succeed, -1 otherwise.
        // TODO, save the course and location strings
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
            ownerId: uid,
            course: course,
            location: location,
            date: startTime,
            subscribers: []
        )
        
        let db = Firestore.firestore()
        
        // First clean up the db
        db.collection("sessions")
            .whereField("ownerId", isEqualTo: uid)
            .getDocuments { (querySnapshot, error) in
                if error != nil {
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
                   
                    db.collection("sessions").document(newSession.id).setData(newSession.asDictionary()) { error in
                        if error != nil {
                            completion(-1) // Return failure if there's an error
                        } else {
                            
                            db.collection("users").document(uid).updateData([
                                "startTime": startTime
                            ]) { error in
                                if error != nil {
                                    completion(-1) // Return failure if there's an error
                                } else {
                                    completion(startTime) // Return success
                                }
                            }
                        }
                    }
                } else {
                    let document = documents[0]
                    db.collection("sessions").document(document.documentID).delete { error in
                        if error != nil {
                            completion(-1) // Return failure if there's an error
                        } else {
                            db.collection("sessions").addDocument(data: newSession.asDictionary()) { error in
                                if error != nil {
                                    completion(-1) // Return failure if there's an error
                                } else {
                                    db.collection("users").document(uid).updateData([
                                        "startTime": startTime
                                    ]) { error in
                                        if error != nil {
                                            completion(-1) // Return failure if there's an error
                                        } else {
                                           
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
    // Get the session of the current user, returns the seconds from 1970 if succeed, otherwise returns -1
    func getSession(completion: @escaping (Double) -> Void) {
        guard let uid = Auth.auth().currentUser?.uid else {
            completion(-1)
            return
        }
        
        let db = Firestore.firestore()
        
        db.collection("sessions")
            .whereField("ownerId", isEqualTo: uid)
            .getDocuments { (querySnapshot, error) in
                if error != nil {
                    completion(-1)
                    return
                }
                
                guard let documents = querySnapshot?.documents else {
                    completion(-1)
                    return
                }
                
                // The case when the current user has a session
                if let document = documents.first {
                    guard let startTime = document.data()["date"] as? Double else {
                        completion(-1) // Return failure if start time is not available
                        return
                    }
                    
                    completion(startTime) // Return success with start time
                } else {
                    
                    completion(-1) // Return failure if no session found
                }
            }
    }
}

