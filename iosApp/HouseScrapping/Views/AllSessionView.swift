//
//  AllSessionView.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-07-07.
//

import SwiftUI
import FirebaseAuth

struct AllSessionView: View {
    @StateObject private var viewModel = AllSessionViewModel()
    
    var body: some View {
        ScrollView {
            LazyVStack(spacing: 70) {
                ForEach(viewModel.sessions) { session in
                    if session.ownerId != Auth.auth().currentUser?.uid {
                        SingleSessionView(session: session)
                            .frame(maxWidth: .infinity)
                    }
                }
                Spacer() // Add a spacer to distribute the remaining space evenly
            }
            .padding()
            
        }
    }
}


struct AllSessionView_Previews: PreviewProvider {
    static var previews: some View {
        AllSessionView()
    }
}
