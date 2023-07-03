//
//  RegisterViewViewModel.swift
//  ToDoList
//
//  Created by Justin Peng on 2023-06-12.
//
import FirebaseFirestore
import Foundation
import FirebaseAuth
class registerViewViewModel: ObservableObject {
    @Published var name = ""
    @Published var email = ""
    @Published var password = ""
    var status : String?
    init(){}
    func register(completion: @escaping (String) -> Void) {
        if !validate() {
            self.status = "Validation failed, check your input format!"
            completion(self.status ?? "")
            return
        }

        checkUserExists(email: email) { [weak self] isExist in
            if isExist {
                self?.status = "Exist"
            }

            if let unwrappedValue = self?.status {
                completion(unwrappedValue)
            } else {
                Auth.auth().createUser(withEmail: self?.email ?? "", password: self?.password ?? "") { [weak self] result, error in
                    if let userId = result?.user.uid {
                        self?.insertUserRecord(id: userId)
                        completion("Your account registration succeeded!")
                    } else {
                        completion("Failed to register the account.")
                    }
                }
            }
        }
    }
    private func insertUserRecord(id: String){
        let newUser = User(
            id: id,
            name: name,
            email: email,
            joined: Date().timeIntervalSince1970,
            imageData: nil
        )

        let db = Firestore.firestore()
        db.collection("users")
            .document(id)
            .setData(newUser.asDictionary())

    }
    private func validate() -> Bool{
        guard !name.trimmingCharacters(in: .whitespaces).isEmpty,
              !email.trimmingCharacters(in: .whitespaces).isEmpty,
              !password.trimmingCharacters(in: .whitespaces).isEmpty else{
            return false
        }
        guard email.contains("@") && email.contains(".") else{
            return false
        }
        guard password.count >= 6 else{
            return false
        }
        return true
    }
    func checkUserExists(email: String, completion: @escaping (Bool) -> Void) {
        let db = Firestore.firestore()
        let usersCollection = db.collection("users")

        usersCollection.whereField("email", isEqualTo: email).getDocuments { snapshot, error in
            if let error = error {
                // Error occurred while fetching documents
                print("Error retrieving user: \(error.localizedDescription)")
                completion(false)
                return
            }

            if let documents = snapshot?.documents, !documents.isEmpty {
                // User with the given email exists in Firestore
                completion(true)
            } else {
                // User with the given email does not exist in Firestore
                completion(false)
            }
        }
    }
}


