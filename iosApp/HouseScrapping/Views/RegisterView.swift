//
//  RegisterView.swift
//  ToDoList
//
//  Created by Justin Peng on 2023-06-12.
//

import SwiftUI

struct RegisterView: View {
    @State var showInvalidAlert = false
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
                        print(status)
                    }
                   
                }
                .padding()
            }
        }
    }
}

struct RegisterView_Previews: PreviewProvider {
    static var previews: some View {
        RegisterView()
    }
}
