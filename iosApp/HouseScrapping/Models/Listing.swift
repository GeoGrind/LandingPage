//
//  User.swift
//  ToDoList
//
//  Created by Justin Peng on 2023-06-12.
//



/*
 What I learned after 4 hours debugging:
 The class being used to retrieve data from firebase has to have <= the fields in the db
 */
import Foundation

struct Listing: Codable,Identifiable {
    // primitive, these fields are mandatory
    let id: String
    let title: String
    let date: Date
    let image: String
    let url: String
    let attributes: Attributes
    // handled
    var dateString: String {
            let formatter = DateFormatter()
            formatter.dateFormat = "EEEE, dd 'of' MMMM"
            return formatter.string(from: date)
    }
}

struct Attributes: Codable {
    let furnished: Bool?
    let petsallowed: Bool?
    let forrentbyhousing: String?
    let rentalsvirtualoptions: String?
    let price: Int?
    let numberbedrooms: Double?
    let numberbathrooms: Double?
}
