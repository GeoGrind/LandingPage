//
//  ToDoListItemView.swift
//  ToDoList
//
//  Created by Justin Peng on 2023-06-12.
//

import SwiftUI

struct SingleListingView: View {
    let item: Listing
    
    var body: some View {
        Button(action: {
            if let url = URL(string: item.url) {
                        UIApplication.shared.open(url)
                    }
        }) {
            HStack {
                VStack(alignment: .leading, spacing: 8) {
                    Text(item.title)
                        .font(.headline)
                    
                    Text(item.dateString)
                        .foregroundColor(.gray)
                    
                    if let price = item.attributes.price {
                        Text("Price: $\(String(price))/mo")
                    }
                    
                    
                    HStack {
                        if let numberOfBathrooms = item.attributes.numberbathrooms {
                            let stringValue = String(numberOfBathrooms)
                            let remove0 = String(stringValue).trimmingCharacters(in: ["0"])
                            let removeDot = String(remove0).trimmingCharacters(in: ["."])
                            Image(systemName: "drop.fill")
                            Text(removeDot)
                        }
                        if let numberOfBedrooms = item.attributes.numberbedrooms {
                            let stringValue = String(numberOfBedrooms)
                            let remove0 = String(stringValue).trimmingCharacters(in: ["0"])
                            let removeDot = String(remove0).trimmingCharacters(in: ["."])
                            Image(systemName: "bed.double.fill")
                            Text("\(removeDot)")
                        }
                        Spacer()
                    }
                }
                
                // Image view on the right-hand side
                if let imageURL = URL(string: item.image) {
                    AsyncImage(url: imageURL) { phase in
                        switch phase {
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 80, height: 80)
                        case .failure(_):
                            Image(systemName: "photo")
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 80, height: 80)
                        case .empty:
                            ProgressView()
                                .frame(width: 80, height: 80)
                        @unknown default:
                            EmptyView()
                        }
                    }
                } else {
                    Image(systemName: "photo")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 80, height: 80)
                }
            }
            .padding()
            .background(Color.white)
            .cornerRadius(10)
            .shadow(radius: 2)
            .padding(.horizontal)
        }
    }
}




//            Button {
//                viewModel.toggleIsDone(item: item)
//            } label:{
//                Image(systemName: item.isDone ? "checkmark.circle.fill" : "circle")
//            }

struct SingleListingView_Previews: PreviewProvider {
    static var previews: some View {
        let listing = Listing(
            id: "1",
            title: "Example Listing",
            date: Date(),
            image: "https://fastly.picsum.photos/id/853/200/300.jpg?hmac=-vUTO-GMdNHJbNIJrZtC4jsw0ybpHVgCrtWkg1DZugg",
            url: "https://www.google.ca/",
            attributes: Attributes(
                furnished: true,
                petsallowed: false,
                forrentbyhousing: "Individual",
                rentalsvirtualoptions: nil,
                price: 1000,
                numberbedrooms: 2,
                numberbathrooms: 1
            )
        )
        SingleListingView(item: listing)
        
    }
}
