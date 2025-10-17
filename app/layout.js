import './globals.css'

export const metadata = {
  title: 'AI双色球融合预测器',
  description: '智能双色球号码融合预测工具',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
