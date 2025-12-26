export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="container py-6 md:py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-end">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} فوتبال آنلاین. تمامی حقوق محفوظ است.
            </p>
            <p className="text-xs text-gray-500">
              پلتفرم داده‌های فوتبال ایران با گیمیفیکیشن غذامحور
            </p>
          </div>
          <div className="flex items-center space-x-reverse space-x-4 text-sm text-gray-500">
            <span>⚽ 🍕</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

