//
//  LoginViewViewModel.swift
//  ToDoList
//
//  Created by Justin Peng on 2023-06-12.
//

import Foundation
import FirebaseAuth
class LoginViewViewModel: ObservableObject{
    @Published var email = ""
    @Published var password = ""
    @Published var errorMessage = ""
    init(){}

    func login()  {
        
        guard validate() else{
            return
        }
        // Try login
        Auth.auth().signIn(withEmail: email, password: password)
    }
    func validate()-> Bool{
        errorMessage = ""
        guard !email.trimmingCharacters(in: .whitespaces).isEmpty,
              !password.trimmingCharacters(in: .whitespaces).isEmpty else {
            errorMessage = "Please fill in all fields."
            return false
        }
        guard email.contains("@") && email.contains(".") else{
            errorMessage = "Please enter proper email."
            return false
        }
        return true
    }
}
