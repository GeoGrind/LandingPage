//
//  AllSessionView.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-07-07.
//

import SwiftUI

struct SingleSessionView: View {
    var session: Session
    @State private var isJoiningSession = false
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
//            Button(action: {
//                            // Perform the join session action here
//                            isJoiningSession = true
//                        }) {
//                            Text("Join Session")
//                                .font(.headline)
//                                .foregroundColor(.white)
//                                .padding()
//                                .background(
//                                    Capsule()
//                                        .fill(Color.blue)
//                                        .shadow(color: .blue, radius: 10, x: 0, y: 0)
//                                )
//                        }
//                        .disabled(isJoiningSession) // Disable the button when already joining the session
            
            Spacer()
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

