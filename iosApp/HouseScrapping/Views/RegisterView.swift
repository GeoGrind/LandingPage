//
//  RegisterView.swift
//  ToDoList
//
//  Created by Justin Peng on 2023-06-12.
//

import SwiftUI

struct RegisterView: View {
    @State var showInvalidAlert = false
    @State var alertText : String?
    @StateObject var viewModel = registerViewViewModel()
    var body: some View {
        VStack{
            // Header
            HeaderView(title: "Register", subtitle: "Start organizaing Todos", angle: -15, background: .orange)
            Spacer()
            Form {
                TextField("Full Name", text: $viewModel.name)
                    .textFieldStyle(DefaultTextFieldStyle())
                    .autocorrectionDisabled()
                TextField("Email Address", text: $viewModel.email)
                    .textFieldStyle(DefaultTextFieldStyle())
                    .autocapitalization(.none)
                    .autocorrectionDisabled()
                SecureField("Password", text: $viewModel.password)
                    .textFieldStyle(DefaultTextFieldStyle())
                TLButton(title: "Create an account", background: .green){
                    viewModel.register { status in
                        DispatchQueue.main.async {
                            self.alertText = status
                            self.showInvalidAlert = true
                        }
                    }
                   
                }
                .padding()
            
            }
        }
        .alert(isPresented: $showInvalidAlert){
            Alert(title: Text("Error"), message: Text(self.alertText!))
        }
    }
}

struct RegisterView_Previews: PreviewProvider {
    static var previews: some View {
        RegisterView()
    }
}
