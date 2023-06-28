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
            ToDoListView(userId: viewModel.currentUserId)
                .tabItem{
                    Label("Home", systemImage: "house")
                }
            ProfileView()
                .tabItem{
                    Label("Profile", systemImage: "person.circle")
                }
            AllListingsView()
                .tabItem{
                    Label("Test", systemImage: "house")
                }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        MainView()
    }
}
