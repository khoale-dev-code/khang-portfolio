import '../index.css'

export const metadata = {
  title: 'Vo Phuc Hoang Khang - Marketing Executive',
  description: 'Marketing portfolio featuring partnership campaigns, measurable outcomes, experience and selected work.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
