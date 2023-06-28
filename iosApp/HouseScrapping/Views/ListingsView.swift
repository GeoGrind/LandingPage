//
//  ListingsView.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-06-19.
//

import SwiftUI
import FirebaseAuth
import FirebaseFirestore
struct ListingsView: View {
    @State private var titles: [String] = []
        
        var body: some View {
            VStack {
                List(titles, id: \.self) { title in
                    Text(title)
                }
            }
            .onAppear {
                fetchTitles()
            }
        }
        
        private func fetchTitles() {
            let firestore = Firestore.firestore()
            let listingsCollection = firestore.collection("listings")
            
            listingsCollection.getDocuments { (snapshot, error) in
                if let error = error {
                    print("Error fetching documents: \(error)")
                    return
                }
                
                guard let documents = snapshot?.documents else {
                    print("No documents found.")
                    return
                }
                
                self.titles = documents.compactMap { $0.data()["title"] as? String }
            }
        }
}

struct ListingsView_Previews: PreviewProvider {
    static var previews: some View {
        ListingsView()
    }
}
