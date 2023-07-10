//
//  SessionController.swift
//  HouseScrapping
//
//  Created by Jingcheng Peng on 2023-07-09.
//

import Foundation
import FirebaseAuth
import FirebaseFirestore
class SessionController{
    
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
                    db.collection("sessions").document(document.documentID).delete { error in
                        if error != nil {
                            completion(0) // Return failure if there's an error
                        } else{
                            // remove the startTime field in the user
                            db.collection("users")
                                .document(uid)
                                .updateData([
                                    "startTime": FieldValue.delete()
                                ]) { error in
                                    if error != nil {
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
