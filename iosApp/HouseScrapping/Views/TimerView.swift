//
//  TestView.swift
//  HouseScrapping
//
//  Created by Justin Peng on 2023-07-04.
//

import SwiftUI
import CountdownView

struct TimerView: View {
    
    @StateObject var viewModel = TimerViewModel()
    @State var countdownTimer = 5
    @State var timerRunning = false
    
    
    let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()
    
    
    var body: some View {
        VStack {
            Text("\(countdownTimer)")
                .padding()
                .onReceive(timer) { _ in
                    if countdownTimer < 10 && timerRunning {
                        countdownTimer += 1
                        viewModel.getStartTime()
                    } else {
                        timerRunning = false
                    }
                    
                }
                .font(.system(size: 40, weight: .bold))
            
            HStack(spacing:30) {
                Button("Start") {
                    timerRunning = true
                }
                
                Button("Reset") {
                    countdownTimer = 5
                }.foregroundColor(.red)
            }
        }
    }
    
}

struct TimerView_Previews: PreviewProvider {
    static var previews: some View {
        TimerView()
    }
}
