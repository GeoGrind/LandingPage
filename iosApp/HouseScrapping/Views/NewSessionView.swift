//
//  NewSessionView.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-07-03.
//

import SwiftUI
import Firebase
import FirebaseAuth
import FirebaseFirestore
struct NewSessionView: View {
    

    @State private var showSheet = false
    @State var courseOptionTag: Int = 0
    @State var locationOptionTag: Int = 0
    @State var startTime: Double = 0
    @StateObject var viewModel = NewSessionViewModel()
    var courseOption = ["CS 240", "CS 246"]
    var locationOption = ["DC", "MC"]
    
    var body: some View {
        VStack {
            Spacer()
            
            
            TimerView(startTime: $startTime)
                .onAppear {
                    self.viewModel.getSession { result in
                        if result >= 0 {
                            startTime = result
                        }
                    }
                }
            
            Spacer()
            if startTime != 0 {
                    Button {
                        self.viewModel.deleteSession { res in
                            if res == 1 {
                                self.startTime = 0
                            }
                        }
                    } label: {
                        Text("Finish the session")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding()
                            .background(
                                Capsule()
                                    .fill(Color.red)
                                    .shadow(color: .red, radius: 10, x: 0, y: 0)
                            )
                    }
                }
                
                Spacer()
                
                Button(action: {
                    self.showSheet = true
                }) {
                    Image(systemName: "play")
                        .padding(.horizontal, 50)
                        .frame(height: 112)
                        .background(LinearGradient(gradient: Gradient(colors: [Color.red, Color.blue]), startPoint: .leading, endPoint: .trailing))
                        .clipShape(Circle())
                        .font(.largeTitle)
                        .foregroundColor(.white)
                        .shadow(color: .gray, radius: 5, x: 0, y: 5)
                }
                
                Spacer()
            
            
        }
        .onAppear {
                let db = Firestore.firestore()
                guard let uid = Auth.auth().currentUser?.uid else{
                    return
                }
                let userRef = db.collection("users").document(uid)
                
                userRef.addSnapshotListener { snapshot, error in
                    guard let document = snapshot else {
                        print("Error fetching document: \(error!)")
                        return
                    }
                    
                    if document.exists {
                        if let data = document.data(), !data.keys.contains("startTime") {
                            self.viewModel.deleteSession { res in
                                if res == 1 {
                                    self.startTime = 0
                                }
                            }
                        }
                    }
                }
            }
        
        .sheet(isPresented: self.$showSheet){
            NavigationView {
                Form {
                    Section(header: Text("Your study session")) {
                        
                        HStack {
                            Picker("Course", selection: $courseOptionTag) {
                                ForEach(courseOption.indices, id: \.self) { index in
                                    Text(courseOption[index])
                                        .tag(index)
                                }
                            }
                            .pickerStyle(MenuPickerStyle())
                            Spacer()
                        }
                        
                        HStack {
                            Picker("Location", selection: $locationOptionTag) {
                                ForEach(locationOption.indices, id: \.self) { index in
                                    Text(locationOption[index])
                                        .tag(index)
                                }
                            }
                            .pickerStyle(MenuPickerStyle())
                            Spacer()
                        }
                        
                        
                    }
                    Button(action: {
                        self.showSheet = false
                        guard let userId = Auth.auth().currentUser?.uid else {
                            return
                        }
                        
                        Firestore.firestore().collection("users").document(userId).getDocument { (document, error) in
                            if let document = document, document.exists {
                                if let isSubscribing = document.data()?["isSubscribing"] as? Bool, isSubscribing {
                                    if let subscribingSession = document.data()?["subscribingSession"] as? String {
                                        // Find the session in Firestore where id matches subscribingSession
                                        Firestore.firestore().collection("sessions").document(subscribingSession).getDocument { (sessionDocument, sessionError) in
                                            if let sessionDocument = sessionDocument, sessionDocument.exists {
                                                if var subscribers = sessionDocument.data()?["subscribers"] as? [String] {
                                                    // Delete the current user from the subscribers array
                                                    if let index = subscribers.firstIndex(of: userId) {
                                                        subscribers.remove(at: index)
                                                    }
                                                    
                                                    // Update the subscribers array in the session document
                                                    Firestore.firestore().collection("sessions").document(subscribingSession).updateData([
                                                        "subscribers": subscribers
                                                    ]) { sessionUpdateError in
                                                        if let sessionUpdateError = sessionUpdateError {
                                                            print("Error updating subscribers array: \(sessionUpdateError)")
                                                        } else {
                                                            print("Subscribers array updated successfully")
                                                        }
                                                        
                                                        // Update user's fields isSubscribing and subscribingSession
                                                        Firestore.firestore().collection("users").document(userId).updateData([
                                                            "isSubscribing": false,
                                                            "subscribingSession": ""
                                                        ]) { userUpdateError in
                                                            if let userUpdateError = userUpdateError {
                                                                print("Error updating isSubscribing and subscribingSession fields: \(userUpdateError)")
                                                            } else {
                                                                print("isSubscribing and subscribingSession fields updated successfully")
                                                            }
                                                            
                                                            // Save the session
                                                            self.viewModel.saveSession(course: courseOption[courseOptionTag], location: locationOption[locationOptionTag]) { res in
                                                                if res >= 0 {
                                                                    self.startTime = res
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            } else {
                                                print("Session document does not exist")
                                            }
                                        }
                                    }
                                } else {
                                    // If the user's "isSubscribing" field is false, simply save the session
                                    self.viewModel.saveSession(course: courseOption[courseOptionTag], location: locationOption[locationOptionTag]) { res in
                                        if res >= 0 {
                                            self.startTime = res
                                        }
                                    }
                                }
                            } else {
                                print("User document does not exist")
                            }
                        }
                    }, label: {
                        HStack {
                            Spacer()
                            Text("Start your session")
                            Spacer()
                        }
                    })
                }.navigationBarTitle("START SESSION")
            }
        }
    }
}
struct NewSessionView_Previews: PreviewProvider {
    static var previews: some View {
        NewSessionView()
    }
}
