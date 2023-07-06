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
            Text(formatTime(elapsedTime))
                .font(.title)
                .padding()
        }
        .onChange(of: startTime) { newStartTime in
            restartTimer()
        }
        .onAppear {
            restartTimer()
        }
    }
    
    private func formatTime(_ time: Double) -> String {
        let minutes = Int(time / 60)
        let seconds = Int(time) % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }
    
    private func restartTimer() {
        timer?.invalidate()
        elapsedTime = 0.0
        startTimer()
    }
    
    private func startTimer() {
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
            elapsedTime += 1.0
        }
    }
}
