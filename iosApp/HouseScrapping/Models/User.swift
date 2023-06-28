//
//  User.swift
//  ToDoList
//
//  Created by Justin Peng on 2023-06-12.
//

import Foundation

struct User: Codable,Identifiable {
    let id: String
    let name: String
    let email: String
    let joined: TimeInterval
}
