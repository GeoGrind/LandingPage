//
//  Session.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-07-04.
//

import Foundation

struct Session: Codable,Identifiable {
    // primitive, these fields are mandatory
    let id: String
    let userId: String
    let course: String
    let location: String
    let date: Double
   
    
}
