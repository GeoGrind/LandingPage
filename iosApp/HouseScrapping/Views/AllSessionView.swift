//
//  AllSessionView.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-07-07.
//

import SwiftUI

struct AllSessionView: View {
    @StateObject private var viewModel = AllSessionViewModel()
    
    var body: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(viewModel.sessions) { session in
                    SingleSessionView(session: session)
                }
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
