export function Sidebar() {
  return (
    <div className="pt-6 px-8 h-full flex flex-col justify-between">
        <div>
            <div className="mb-2 flex items-center space-x-1">
                <img src="eye.svg"/>
                <h2 className="px-4 pl-0 text-2xl tracking-tight">
                    SentimentWatch 
                </h2>
            </div>
            <p className="text-sm font-light text-muted-foreground">
                Use AI to effortlessly keep up with the latest financial sentiment in news
            </p>
        </div>
    </div>
  )
}