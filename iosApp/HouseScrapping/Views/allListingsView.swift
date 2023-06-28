//
//  allListingView.swift
//  allListingView
//
//  Created by Justin Peng on 2023-06-12.
//

import SwiftUI
import FirebaseFirestoreSwift

struct AllListingsView: View {
    @StateObject var viewModel : AllListingsViewModel
    @FirestoreQuery var items: [Listing]
   
    init(){
        self._items = FirestoreQuery(
            collectionPath: "listing"
        )
        self._viewModel = StateObject(wrappedValue: AllListingsViewModel())
    }
    
    var body: some View {
        NavigationView{
            VStack{
                List(items) { item in
                    
                    SingleListingView(item: item)

                    // Boolean field
//                    if let petsAllowed = item.attributes.petsallowed {
//                        if petsAllowed {
//                            Text("True")
//                        } else {
//                            Text("False")
//                        }
//                    } else {
//                        Text("Unknown")
//                    }
                    
                    // String field
//                    if let rentalsvirtualoptions = item.attributes.rentalsvirtualoptions {
//                        Text(rentalsvirtualoptions)
//                    } else {
//                        Text("Nil")
//                    }
                    
                }
            }
        }
    }
}

struct AllListingsView_Previews: PreviewProvider {
    static var previews: some View {
        AllListingsView()
    }
}
