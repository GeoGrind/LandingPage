//
//  MainView.swift
//  ToDoList
//
//  Created by Justin Peng on 2023-06-12.
//

import SwiftUI

struct MainView: View {
    @StateObject var viewModel = MainViewViewModel()
    
    var body: some View {
        if viewModel.isSignedIn, !viewModel.currentUserId.isEmpty {
            accountView
        } else{
            LoginView()
        }
    }
    
    @ViewBuilder
    var accountView: some View{
        TabView {
            
            ProfileView()
                .tabItem{
                    Label("Profile", systemImage: "person.circle")
                }
            NewSessionView()
                .tabItem {
                        Label(
                            title: { Text("New Session") },
                            icon: {
                                Image(systemName: "plus.app.fill")
                                    .font(.system(size: 32))
                                    .foregroundColor(.blue)
                            }
                        )
                }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        MainView()
    }
}
