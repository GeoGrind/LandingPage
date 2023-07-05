//
//  TestView.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-07-03.
//

import SwiftUI

struct NewSessionView: View {
    
    @State private var showSheet = false
    @State var courseOptionTag: Int = 0
    @State var locationOptionTag: Int = 0
    @StateObject var viewModel = NewSessionViewModel()
    var courseOption = ["CS 240", "CS 246"]
    var locationOption = ["DC", "MC"]
    
    var body: some View {
        VStack {
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
            }
            Spacer()
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
                        self.viewModel.save(course: courseOption[courseOptionTag], location: locationOption[locationOptionTag])
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
