//
//  AllSessionViewModel.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-07-07.
//

import Foundation
import FirebaseFirestore
import FirebaseFirestoreSwift
import Combine

class AllSessionViewModel: ObservableObject {
    @Published var sessions: [Session] = []
    
    private var cancellables: Set<AnyCancellable> = []
    private var listener: ListenerRegistration?
    
    init() {
        fetchSessions()
    }
    
    private func fetchSessions() {
        let db = Firestore.firestore()
        let sessionsCollection = db.collection("sessions")
        
        listener = sessionsCollection
            .addSnapshotListener { querySnapshot, error in
                if let error = error {
                    // Handle error
                    print("Error fetching sessions: \(error.localizedDescription)")
                    
                    return
                }
                
                guard let documents = querySnapshot?.documents else {
                    // Handle empty or nil querySnapshot
                    return
                }
                
                let fetchedSessions = documents.compactMap { document -> Session? in
                    do {
                        return try document.data(as: Session.self)
                    } catch {
                        // Handle error in converting document to Session
                        print("Error decoding session document: \(error.localizedDescription)")
                        return nil
                    }
                }
                
                self.sessions = fetchedSessions
            }
    }
    
    deinit {
        listener?.remove()
    }
}
