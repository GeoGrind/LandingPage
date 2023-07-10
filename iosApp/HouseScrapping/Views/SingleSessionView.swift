//
//  AllSessionView.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-07-07.
//

import SwiftUI
import FirebaseAuth
import FirebaseFirestore
import Foundation
struct SingleSessionView: View {
    var session: Session
    
    @StateObject private var viewModel = SingleSessionViewModel()
    var sessionController = SessionController()
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(session.course)
                .font(.title)
                .fontWeight(.bold)
            
            Text("Date: \(formatDate(session.date))")
                .font(.body)
                .foregroundColor(.gray)
            
            Text("Location: \(session.location)")
                .font(.body)
                .foregroundColor(.gray)
            
            Text("User ID: \(session.ownerId)")
                .font(.body)
                .foregroundColor(.gray)
           
                
            Button(action: {
                viewModel.addSubscriberToCurrentSession(sessionID: session.id)
                sessionController.deleteSession { res in
                    
                    if res == 1 {
                        // go to a firestore collection called "users", change the string field "subscribingSession" to {session.id}
                        guard let userId = Auth.auth().currentUser?.uid else{
                            return
                        }
                        Firestore.firestore().collection("users").document(userId).updateData([
                                    "subscribingSession": session.id
                                ]) { error in
                                    if let error = error {
                                        print("Error updating subscribingSession field: \(error)")
                                    } else {
                                        print("subscribingSession field updated successfully")
                                    }
                        }
                    }
                }
            }) {
                Text("Join Session")
                    .font(.subheadline)
                    .foregroundColor(.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(
                        Capsule()
                            .fill(viewModel.isSubscribing ? Color.gray : Color.blue) // Switch to gray if isJoiningSession is true
                    )
            }
            .disabled(viewModel.isSubscribing)
            
            Spacer()
        }
        .onAppear {
            if let userId = Auth.auth().currentUser?.uid {
                viewModel.listenToUserSubscriptionStatus(userId: userId)
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(10)
        .shadow(color: Color.gray.opacity(0.4), radius: 4, x: 0, y: 2)
        .padding(.horizontal)
        .frame(height: 150) // Set a fixed height for the card
        
    }
    
    func formatDate(_ timestamp: Double) -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateStyle = .short
        dateFormatter.timeStyle = .short
        
        let date = Date(timeIntervalSince1970: timestamp)
        return dateFormatter.string(from: date)
    }
}


struct SingleSessionView_Previews: PreviewProvider {
    static var previews: some View {
        let session = Session(id: "77F6A733-3841-4980-A845-1F8689EBF775",
                              ownerId: "9gn4QZbiEtRm0414IMsdBrZiLXv2",
                              course: "CS 240",
                              location: "DC",
                              date: 1688767501.1226)
        
        SingleSessionView(session: session)
            .previewLayout(.sizeThatFits)
    }
}

