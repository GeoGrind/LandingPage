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
    @Binding var startTime: Double
    @State private var elapsedTime: Double = 0.0
    @State private var timer: Timer?
    
    var body: some View {
        VStack {
            if startTime != 0 {
                Text(formatTime(elapsedTime))
                    .font(.system(size: 64, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                    .padding()
                    .background(
                        Circle()
                            .foregroundColor(Color.purple)
                            .shadow(color: .purple, radius: 10, x: 0, y: 0)
                            .frame(width: 300, height: 300)
                    )
                    .overlay(
                        Circle()
                            .stroke(Color.white, lineWidth: 8)
                            .frame(width: 316, height: 316)
                    )
            }
        }
        .onAppear {
            restartTimer(newStartTime: startTime)
        }
        .onChange(of: startTime) { newStartTime in
            restartTimer(newStartTime: newStartTime)
        }
    }
    
    private func formatTime(_ time: Double) -> String {
        let hours = Int(time / 3600)
        let minutes = Int((time / 60).truncatingRemainder(dividingBy: 60))
        let seconds = Int(time.truncatingRemainder(dividingBy: 60))
        return String(format: "%02d:%02d:%02d", hours, minutes, seconds)
    }
    
    private func restartTimer(newStartTime: Double) {
        timer?.invalidate()
        elapsedTime = Date().timeIntervalSince1970 - newStartTime
        startTimer()
    }
    
    private func startTimer() {
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
            elapsedTime += 1.0
        }
    }
}
