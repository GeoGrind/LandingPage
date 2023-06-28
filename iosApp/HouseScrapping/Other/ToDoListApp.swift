//
//  ToDoListApp.swift
//  ToDoList
//
//  Created by Justin Peng on 2023-06-12.
//
import FirebaseCore
import SwiftUI

@main
struct ToDoListApp: App {
    init () {
        FirebaseApp.configure()
    }
    var body: some Scene {
        WindowGroup {
            MainView()
        }
    }
}
