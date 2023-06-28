//
//
//  ToDoListViewViewModel.swift
//  ToDoList
//
//  Created by Justin Peng on 2023-06-12.
//
import FirebaseFirestore
import Foundation
import Foundation


/// ViewModel for list of items view
/// Primary tab
class ToDoListViewViewModel: ObservableObject {
    @Published var showingNewItemView = false
    private let userId: String
    init(userId: String){
        self.userId = userId
    }
    
    /// Delete to do list item
    /// - Parameter id: item id to delete
    func delete(id: String){
        let db = Firestore.firestore()
        db.collection("users")
            .document(userId)
            .collection("todos")
            .document(id)
            .delete()
    }
}
