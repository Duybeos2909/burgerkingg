(() => {
  const dictionaries = {
    en: {
      'page.title': 'Burger King — Flame-Grilled, Your Way',
      'skip.content': 'Skip to content', 'nav.primary': 'Primary navigation', 'nav.main': 'Main navigation',
      'nav.home': 'Home', 'nav.menu': 'Menu', 'nav.deals': 'Deals', 'nav.stores': 'Find a Store',
      'nav.rewards': 'Rewards', 'nav.app': 'App', 'nav.order': 'ORDER NOW', 'nav.signIn': 'SIGN IN',
      'nav.openMenu': 'Open menu', 'nav.switchLanguage': 'Switch language', 'auth.logout': 'LOG OUT',
      'auth.title': 'Welcome back 🔥', 'auth.description': 'Sign in to sync your cart, earn points, and redeem rewards.',
      'cart.label': 'Shopping cart', 'cart.title': 'Your Bag', 'cart.close': 'Close cart',
      'cart.empty': 'Your bag is empty. Add something flame-grilled.', 'cart.subtotal': 'Subtotal',
      'cart.checkout': 'Checkout', 'cart.add': 'Add to bag +', 'cart.each': 'each',
      'hero.banner': '🔥 LIMITED TIME: Double Whopper for $5.99 — Today Only',
      'hero.eyebrow': 'Flame-Grilled Since 1953', 'hero.title': 'Have It<br>Your Way.',
      'hero.description': '100% beef. Flame-grilled to perfection. No freezers. No shortcuts. Ever.',
      'hero.order': 'ORDER NOW', 'hero.seeMenu': 'SEE MENU',
      'menu.eyebrow': 'The Menu', 'menu.title': 'Built Different.',
      'menu.description': 'Browse the full menu, filter by craving, and add your favourites to the bag in a tap.',
      'category.all': 'All', 'category.burgers': 'Burgers', 'category.chicken': 'Chicken',
      'category.sides': 'Sides', 'category.drinks': 'Drinks', 'category.desserts': 'Desserts',
      'category.combos': 'Combos', 'category.vegetarian': 'Vegetarian',
      'deals.eyebrow': 'Hot Right Now', 'deals.title': 'Deals That Hit Different.',
      'deals.description': 'App-exclusive offers, meal combos, and daily specials — always fresh, always urgent.',
      'deals.limited': 'Limited Time', 'deals.app': 'App Exclusive', 'deals.apply': 'Apply Code →',
      'deals.see': 'See Deal →', 'deals.redeem': 'Redeem Now →',
      'stores.eyebrow': 'Find Us', 'stores.title': '12,000 Reasons to Never Cook Again.',
      'stores.search': '🔍 Enter your city or postcode...', 'stores.searchLabel': 'Search stores by city or postcode',
      'stores.location': 'Use My Location', 'stores.filterLabel': 'Store filters',
      'stores.open': 'Open Now', 'stores.map': 'Interactive Map',
      'stores.mapNote': 'In production: integrate Google Maps API with store pins',
      'stores.none': 'No stores found', 'stores.tryAgain': 'Try another city, postcode, or filter.',
      'stores.order': 'Order Pickup Here →', 'stores.select': 'Select Store', 'stores.selected': 'Selected',
      'stores.nearby': 'Nearby', 'feature.driveThru': 'Drive-Thru', 'feature.delivery': 'Delivery',
      'feature.dineIn': 'Dine-In', 'feature.open24': '24H',
      'rewards.title': 'Earn While<br>You Eat.',
      'rewards.description': 'Join BK Rewards and earn points on every order. Redeem for free food, exclusive deals, and member-only surprises.',
      'rewards.earn': 'Earn <strong>10pts</strong> per $1 spent',
      'rewards.freeWhopper': 'Free Whopper at <strong>500 points</strong>',
      'rewards.memberDeals': 'Exclusive member deals <strong>every week</strong>',
      'rewards.join': 'Join Free — Takes 30 Seconds', 'form.firstName': 'First Name',
      'form.email': 'Email Address', 'form.password': 'Password', 'form.dob': 'Date of Birth',
      'form.postcode': 'Postcode / ZIP', 'form.passwordHint': 'Minimum 8 characters',
      'form.emailDeals': "I'd like exclusive BK deals by email", 'form.createAccount': 'CREATE MY ACCOUNT →',
      'form.terms': 'By joining you agree to our Terms. Unsubscribe anytime.',
      'form.signIn': 'Already a member? Sign in', 'form.complete': 'Please complete all required fields.',
      'form.success': "🎉 You're in. Your BK Rewards account is ready and your session is now active.",
      'app.eyebrow': 'The BK App', 'app.title': 'Order. Earn.<br>Rule.',
      'app.description': 'Skip the queue. Unlock app-only deals. Earn points on every order. Available on iOS and Android — free, always.',
      'app.orderAhead': '📱 Order ahead — skip the queue', 'app.exclusive': '🎁 App-exclusive deals every week',
      'app.rewards': '👑 BK Rewards built in', 'app.nearest': '📍 Find your nearest restaurant instantly',
      'app.notifications': '🔔 Flash sale push notifications', 'app.store': '🍎 Download on App Store',
      'app.google': '▶ Get it on Google Play', 'app.goodMorning': 'Good Morning',
      'app.todayDeal': "Today's deal", 'app.redeem': 'Tap to redeem in-app',
      'app.rewardsTitle': 'Rewards', 'app.points': 'You have <strong>420 points</strong> — almost a free Whopper.',
      'app.nearestTitle': 'Nearest restaurant', 'app.pickup': 'BK Midtown · 0.8 mi away · Pickup in 14 min',
      'app.account': 'Account', 'footer.about': 'About Us', 'footer.careers': 'Careers',
      'footer.press': 'Press', 'footer.franchise': 'Franchising', 'footer.sustainability': 'Sustainability',
      'footer.menu': 'MENU', 'footer.company': 'COMPANY', 'footer.follow': 'FOLLOW US',
      'footer.est': 'Est. 1953. Flame-grilled, not fried. Ever.',
      'footer.copyright': '🔥 © 2024 Burger King Corporation. All rights reserved.',
      'footer.twitterX': 'Twitter/X', 'form.invalidEmail': 'Please enter a valid email address.',
      'hero.tickerReviews': '⭐ 4.7/5 from 2.3M reviews',
      'hero.tickerStores': '🍔 12,000+ restaurants worldwide', 'hero.tickerApp': '📱 #1 Fast Food App 2024',
      'hero.badgeFresh': 'Fresh off the flame', 'hero.badgeOrder': 'Made to order',
      'hero.badgeDescription': 'Editorial food styling meets fast-food urgency.',
      'footer.privacy': 'Privacy Policy', 'footer.terms': 'Terms of Service',
      'footer.cookies': 'Cookie Settings', 'footer.accessibility': 'Accessibility',
      'modal.title': 'Wait — before you go! 🔥',
      'modal.description': 'Get 20% off your first order with our welcome offer before the flame cools down.',
      'modal.grab': 'Grab the Deal', 'modal.noThanks': 'No thanks', 'modal.close': 'Close',
      'menu.desc.whopper': 'Flame-grilled beef, fresh tomatoes, crisp lettuce, creamy mayo.',
      'menu.desc.doubleWhopper': 'Two flame-grilled patties, all the fixings, unstoppable.',
      'menu.desc.crispyChicken': 'Crispy hand-breaded fillet, pickles, mayo on a brioche bun.',
      'menu.desc.spicyChicken': 'Extra heat, extra crunch — for the brave.',
      'menu.desc.veggie': 'Garden-fresh plant patty with all the classics.',
      'menu.desc.onionRings': 'Golden, crispy, stacked high.', 'menu.desc.fries': 'Salted golden perfection.',
      'menu.desc.shake': 'Thick, creamy, and non-negotiable.', 'menu.desc.frozenCoke': 'Icy, refreshing, iconic.',
      'menu.desc.combo': 'Whopper + Fries + Drink — the classic trio.',
      'menu.desc.chickenRoyal': 'Crispy chicken, rich mayo, shredded lettuce.',
      'menu.desc.brownie': 'Warm, fudgy, dangerously good.',
      'menu.vi.whopper': 'Bò nướng lửa, cà chua tươi, xà lách giòn và sốt mayonnaise béo ngậy.',
      'menu.vi.doubleWhopper': 'Hai miếng bò nướng lửa cùng đầy đủ topping, ngon khó cưỡng.',
      'menu.vi.crispyChicken': 'Gà phi lê tẩm bột chiên giòn, dưa chuột muối và sốt mayo trên bánh brioche.',
      'menu.vi.spicyChicken': 'Cay hơn, giòn hơn, dành cho người mê thử thách.',
      'menu.vi.veggie': 'Burger thực vật tươi ngon cùng các loại topping quen thuộc.',
      'menu.vi.onionRings': 'Hành tây chiên vàng giòn, xếp đầy đặn.', 'menu.vi.fries': 'Khoai tây chiên vàng thơm, nêm muối vừa vị.',
      'menu.vi.shake': 'Đậm đặc, béo mịn, ngon không thể chối từ.', 'menu.vi.frozenCoke': 'Mát lạnh, sảng khoái, đậm chất biểu tượng.',
      'menu.vi.combo': 'Whopper + khoai tây chiên + nước uống, bộ ba kinh điển.',
      'menu.vi.chickenRoyal': 'Gà giòn, sốt mayo béo ngậy và xà lách thái sợi.',
      'menu.vi.brownie': 'Brownie ấm mềm, đậm vị chocolate, ngon khó cưỡng.',
      'deal.title.doubleDownDeal': 'Double Down Deal', 'deal.title.loyaltyBonus': 'Loyalty Bonus',
      'deal.title.freeFriesFriday': 'Free Fries Friday', 'deal.title.appExclusive': 'App Exclusive',
      'deal.title.comboKing': 'Combo King',
      'deal.vi.doubleDownDeal': 'Ưu đãi Double Down', 'deal.vi.loyaltyBonus': 'Thưởng khách hàng thân thiết',
      'deal.vi.freeFriesFriday': 'Thứ Sáu khoai tây miễn phí', 'deal.vi.appExclusive': 'Ưu đãi độc quyền trên ứng dụng',
      'deal.vi.comboKing': 'Combo Hoàng Gia',
      'deal.tag.flash': '🔥 Flash Sale', 'deal.tag.members': '👑 Members', 'deal.tag.weekly': '🍟 Weekly',
      'deal.tag.app': '📱 App Only', 'deal.tag.value': '🍔 Value',
      'deal.offer.doubleDown': '2 Whoppers + 2 Large Fries for $12',
      'deal.offer.points': 'Earn 3x points on all orders this weekend',
      'deal.offer.fries': 'Free Large Fries with any burger purchase',
      'deal.offer.app': '20% off your first app order', 'deal.offer.combo': 'Any combo for $7.99 all day',
      'deal.viOffer.doubleDown': '2 Whopper + 2 khoai tây chiên cỡ lớn chỉ $12',
      'deal.viOffer.points': 'Nhận gấp 3 điểm cho mọi đơn hàng cuối tuần này',
      'deal.viOffer.fries': 'Tặng khoai tây chiên cỡ lớn khi mua bất kỳ burger nào',
      'deal.viOffer.app': 'Giảm 20% cho đơn hàng đầu tiên trên ứng dụng',
      'deal.viOffer.combo': 'Combo bất kỳ chỉ $7.99 cả ngày',
      'feature.openNow': 'Open Now', 'feature.open': 'Open', 'feature.closed': 'Closed',
      'feature.closes': 'Closes', 'feature.hours': 'Open 24hrs', 'feature.selectedStore': '📍 Pickup store: choose a store below',
      'feature.pickupStore': '📍 Pickup store',
      'feature.guestCheckout': 'Guest checkout', 'feature.signInPoints': 'Sign in to earn points',
      'feature.promo': 'Promo code (optional)', 'feature.addSomething': 'Your bag is empty. Add something flame-grilled.'
    },
    vi: {
      'page.title': 'Burger King — Nướng lửa, đúng gu bạn',
      'skip.content': 'Bỏ qua đến nội dung', 'nav.primary': 'Điều hướng chính', 'nav.main': 'Thanh điều hướng chính',
      'nav.home': 'Trang chủ', 'nav.menu': 'Thực đơn', 'nav.deals': 'Ưu đãi', 'nav.stores': 'Tìm nhà hàng',
      'nav.rewards': 'Tích điểm', 'nav.app': 'Ứng dụng', 'nav.order': 'ĐẶT MÓN NGAY', 'nav.signIn': 'ĐĂNG NHẬP',
      'nav.openMenu': 'Mở menu', 'nav.switchLanguage': 'Đổi ngôn ngữ', 'auth.logout': 'ĐĂNG XUẤT',
      'auth.title': 'Chào mừng bạn quay lại 🔥', 'auth.description': 'Đăng nhập để đồng bộ giỏ hàng, tích điểm và đổi ưu đãi.',
      'cart.label': 'Giỏ hàng', 'cart.title': 'Giỏ hàng của bạn', 'cart.close': 'Đóng giỏ hàng',
      'cart.empty': 'Giỏ hàng đang trống. Hãy chọn món nướng lửa yêu thích.', 'cart.subtotal': 'Tạm tính',
      'cart.checkout': 'Thanh toán', 'cart.add': 'Thêm vào giỏ +', 'cart.each': 'mỗi món',
      'hero.banner': '🔥 ƯU ĐÃI CÓ HẠN: Double Whopper chỉ $5.99 — Chỉ hôm nay',
      'hero.eyebrow': 'Nướng lửa từ năm 1953', 'hero.title': 'Thưởng thức<br>theo cách của bạn.',
      'hero.description': '100% thịt bò. Nướng lửa thơm ngon hoàn hảo. Không cấp đông. Không lối tắt.',
      'hero.order': 'ĐẶT MÓN NGAY', 'hero.seeMenu': 'XEM THỰC ĐƠN',
      'menu.eyebrow': 'Thực đơn', 'menu.title': 'Khác biệt từ chất lượng.',
      'menu.description': 'Khám phá thực đơn, chọn món bạn thích và thêm vào giỏ chỉ với một chạm.',
      'category.all': 'Tất cả', 'category.burgers': 'Burger', 'category.chicken': 'Gà',
      'category.sides': 'Món ăn kèm', 'category.drinks': 'Thức uống', 'category.desserts': 'Tráng miệng',
      'category.combos': 'Combo', 'category.vegetarian': 'Món chay',
      'deals.eyebrow': 'Ưu đãi nổi bật', 'deals.title': 'Ưu đãi ngon khó cưỡng.',
      'deals.description': 'Ưu đãi độc quyền trên ứng dụng, combo hấp dẫn và món ngon mỗi ngày.',
      'deals.limited': 'Ưu đãi có hạn', 'deals.app': 'Ưu đãi độc quyền trên ứng dụng', 'deals.apply': 'Dùng mã →',
      'deals.see': 'Xem ưu đãi →', 'deals.redeem': 'Nhận ưu đãi →',
      'stores.eyebrow': 'Tìm chúng tôi', 'stores.title': '12.000 lý do để bạn không cần vào bếp.',
      'stores.search': '🔍 Nhập thành phố hoặc mã bưu chính...', 'stores.searchLabel': 'Tìm nhà hàng theo thành phố hoặc mã bưu chính',
      'stores.location': 'Dùng vị trí của tôi', 'stores.filterLabel': 'Lọc nhà hàng',
      'stores.open': 'Đang mở cửa', 'stores.map': 'Bản đồ tương tác',
      'stores.mapNote': 'Bản đồ vị trí nhà hàng sẽ được tích hợp tại đây',
      'stores.none': 'Không tìm thấy nhà hàng', 'stores.tryAgain': 'Hãy thử thành phố, mã bưu chính hoặc bộ lọc khác.',
      'stores.order': 'Đặt món mang đi tại đây →', 'stores.select': 'Chọn nhà hàng', 'stores.selected': 'Đã chọn',
      'stores.nearby': 'Gần đây', 'feature.driveThru': 'Mua hàng không cần xuống xe', 'feature.delivery': 'Giao hàng',
      'feature.dineIn': 'Dùng tại nhà hàng', 'feature.open24': '24 giờ',
      'rewards.title': 'Ăn ngon<br>tích điểm liền tay.',
      'rewards.description': 'Tham gia BK Rewards để tích điểm mỗi đơn hàng. Đổi điểm lấy món ngon, ưu đãi độc quyền và quà dành riêng cho thành viên.',
      'rewards.earn': 'Tích <strong>10 điểm</strong> cho mỗi $1 chi tiêu',
      'rewards.freeWhopper': 'Đổi Whopper miễn phí với <strong>500 điểm</strong>',
      'rewards.memberDeals': 'Ưu đãi độc quyền <strong>mỗi tuần</strong>',
      'rewards.join': 'Đăng ký miễn phí — Chỉ mất 30 giây', 'form.firstName': 'Tên',
      'form.email': 'Địa chỉ email', 'form.password': 'Mật khẩu', 'form.dob': 'Ngày sinh',
      'form.postcode': 'Mã bưu chính', 'form.passwordHint': 'Tối thiểu 8 ký tự',
      'form.emailDeals': 'Nhận ưu đãi BK độc quyền qua email', 'form.createAccount': 'TẠO TÀI KHOẢN →',
      'form.terms': 'Khi đăng ký, bạn đồng ý với Điều khoản. Bạn có thể hủy bất cứ lúc nào.',
      'form.signIn': 'Đã là thành viên? Đăng nhập', 'form.complete': 'Vui lòng điền đầy đủ các mục bắt buộc.',
      'form.success': '🎉 Hoàn tất! Tài khoản BK Rewards đã sẵn sàng và bạn đã đăng nhập.',
      'app.eyebrow': 'Ứng dụng BK', 'app.title': 'Đặt món. Tích điểm.<br>Thỏa đam mê.',
      'app.description': 'Không cần xếp hàng. Mở khóa ưu đãi độc quyền. Tích điểm mỗi đơn hàng. Có trên iOS và Android — luôn miễn phí.',
      'app.orderAhead': '📱 Đặt trước — không cần xếp hàng', 'app.exclusive': '🎁 Ưu đãi riêng trên ứng dụng mỗi tuần',
      'app.rewards': '👑 Tích hợp BK Rewards', 'app.nearest': '📍 Tìm nhà hàng gần bạn ngay lập tức',
      'app.notifications': '🔔 Nhận thông báo ưu đãi chớp nhoáng', 'app.store': '🍎 Tải trên App Store',
      'app.google': '▶ Tải trên Google Play', 'app.goodMorning': 'Chào buổi sáng',
      'app.todayDeal': 'Ưu đãi hôm nay', 'app.redeem': 'Chạm để đổi ưu đãi trên ứng dụng',
      'app.rewardsTitle': 'Tích điểm', 'app.points': 'Bạn có <strong>420 điểm</strong> — sắp đổi được Whopper miễn phí.',
      'app.nearestTitle': 'Nhà hàng gần nhất', 'app.pickup': 'BK Midtown · cách 0,8 dặm · nhận món sau 14 phút',
      'app.account': 'Tài khoản', 'footer.about': 'Về chúng tôi', 'footer.careers': 'Tuyển dụng',
      'footer.press': 'Báo chí', 'footer.franchise': 'Nhượng quyền', 'footer.sustainability': 'Phát triển bền vững',
      'footer.menu': 'THỰC ĐƠN', 'footer.company': 'CÔNG TY', 'footer.follow': 'THEO DÕI CHÚNG TÔI',
      'footer.est': 'Thành lập năm 1953. Nướng lửa, không chiên ngập dầu.',
      'footer.copyright': '🔥 © 2024 Burger King Corporation. Đã đăng ký bản quyền.',
      'footer.twitterX': 'Twitter/X', 'form.invalidEmail': 'Vui lòng nhập địa chỉ email hợp lệ.',
      'hero.tickerReviews': '⭐ 4,7/5 từ 2,3 triệu lượt đánh giá',
      'hero.tickerStores': '🍔 Hơn 12.000 nhà hàng trên toàn thế giới', 'hero.tickerApp': '📱 Ứng dụng thức ăn nhanh số 1 năm 2024',
      'hero.badgeFresh': 'Vừa nướng xong', 'hero.badgeOrder': 'Làm theo yêu cầu',
      'hero.badgeDescription': 'Hương vị chỉn chu, phục vụ nhanh chóng.',
      'footer.privacy': 'Chính sách quyền riêng tư', 'footer.terms': 'Điều khoản dịch vụ',
      'footer.cookies': 'Cài đặt cookie', 'footer.accessibility': 'Khả năng truy cập',
      'modal.title': 'Khoan đã — trước khi bạn rời đi! 🔥',
      'modal.description': 'Nhận giảm giá 20% cho đơn hàng đầu tiên với ưu đãi chào mừng từ BK.',
      'modal.grab': 'Nhận ưu đãi', 'modal.noThanks': 'Không, cảm ơn', 'modal.close': 'Đóng',
      'menu.vi.whopper': 'Bò nướng lửa, cà chua tươi, xà lách giòn và sốt mayonnaise béo ngậy.',
      'menu.vi.doubleWhopper': 'Hai miếng bò nướng lửa cùng đầy đủ topping, ngon khó cưỡng.',
      'menu.vi.crispyChicken': 'Gà phi lê tẩm bột chiên giòn, dưa chuột muối và sốt mayo trên bánh brioche.',
      'menu.vi.spicyChicken': 'Cay hơn, giòn hơn, dành cho người mê thử thách.',
      'menu.vi.veggie': 'Burger thực vật tươi ngon cùng các loại topping quen thuộc.',
      'menu.vi.onionRings': 'Hành tây chiên vàng giòn, xếp đầy đặn.', 'menu.vi.fries': 'Khoai tây chiên vàng thơm, nêm muối vừa vị.',
      'menu.vi.shake': 'Đậm đặc, béo mịn, ngon không thể chối từ.', 'menu.vi.frozenCoke': 'Mát lạnh, sảng khoái, đậm chất biểu tượng.',
      'menu.vi.combo': 'Whopper + khoai tây chiên + nước uống, bộ ba kinh điển.',
      'menu.vi.chickenRoyal': 'Gà giòn, sốt mayo béo ngậy và xà lách thái sợi.',
      'menu.vi.brownie': 'Brownie ấm mềm, đậm vị chocolate, ngon khó cưỡng.',
      'deal.vi.doubleDownDeal': 'Ưu đãi Double Down', 'deal.vi.loyaltyBonus': 'Thưởng khách hàng thân thiết',
      'deal.vi.freeFriesFriday': 'Thứ Sáu khoai tây miễn phí', 'deal.vi.appExclusive': 'Ưu đãi độc quyền trên ứng dụng',
      'deal.vi.comboKing': 'Combo Hoàng Gia',
      'deal.viOffer.doubleDown': '2 Whopper + 2 khoai tây chiên cỡ lớn chỉ $12',
      'deal.viOffer.points': 'Nhận gấp 3 điểm cho mọi đơn hàng cuối tuần này',
      'deal.viOffer.fries': 'Tặng khoai tây chiên cỡ lớn khi mua bất kỳ burger nào',
      'deal.viOffer.app': 'Giảm 20% cho đơn hàng đầu tiên trên ứng dụng',
      'deal.viOffer.combo': 'Combo bất kỳ chỉ $7.99 cả ngày',
      'deal.viTag.flash': '🔥 Ưu đãi chớp nhoáng', 'deal.viTag.members': '👑 Thành viên',
      'deal.viTag.weekly': '🍟 Hàng tuần', 'deal.viTag.app': '📱 Chỉ trên ứng dụng',
      'deal.viTag.value': '🍔 Giá tốt',
      'feature.openNow': 'Đang mở cửa', 'feature.open': 'Đang mở cửa', 'feature.closed': 'Đã đóng cửa',
      'feature.closes': 'Đóng cửa lúc', 'feature.hours': 'Mở cửa 24 giờ',
      'feature.selectedStore': '📍 Nhà hàng nhận món: chọn một địa điểm bên dưới',
      'feature.pickupStore': '📍 Nhà hàng nhận món',
      'feature.guestCheckout': 'Thanh toán không cần tài khoản', 'feature.signInPoints': 'Đăng nhập để tích điểm',
      'feature.promo': 'Mã ưu đãi (không bắt buộc)', 'feature.addSomething': 'Giỏ hàng đang trống. Hãy chọn món nướng lửa yêu thích.'
    }
  };

  const storageKey = 'bk_language';
  let currentLanguage = localStorage.getItem(storageKey) === 'vi' ? 'vi' : 'en';

  function translate(key, fallback = key) {
    return dictionaries[currentLanguage][key] || dictionaries.en[key] || fallback;
  }

  function applyTranslations() {
    document.documentElement.lang = currentLanguage;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      element.innerHTML = translate(key, element.textContent.trim());
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      element.placeholder = translate(element.dataset.i18nPlaceholder, element.placeholder);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute('aria-label', translate(element.dataset.i18nAriaLabel, element.getAttribute('aria-label')));
    });
    const button = document.getElementById('language-toggle');
    if (button) {
      button.setAttribute('aria-label', `${translate('nav.switchLanguage')}: ${currentLanguage.toUpperCase()}`);
      button.querySelectorAll('[data-lang-code]').forEach((label) => {
        label.classList.toggle('active', label.dataset.langCode === currentLanguage);
      });
    }
    document.dispatchEvent(new CustomEvent('bk-language-change', { detail: { language: currentLanguage } }));
  }

  function setLanguage(language) {
    if (!dictionaries[language] || language === currentLanguage) return;
    currentLanguage = language;
    localStorage.setItem(storageKey, currentLanguage);
    applyTranslations();
  }

  function getContentToken(value, values) {
    return values[String(value || '').trim().toLowerCase()] || '';
  }

  function localizeMenuItem(item) {
    const tokens = {
      'whopper': 'whopper', 'double whopper': 'doubleWhopper',
      'crispy chicken sandwich': 'crispyChicken', 'spicy crispy chicken': 'spicyChicken',
      'bk veggie burger': 'veggie', 'onion rings': 'onionRings', 'large fries': 'fries',
      'chocolate shake': 'shake', 'frozen coke': 'frozenCoke', 'whopper combo': 'combo',
      'chicken royal': 'chickenRoyal', 'chocolate brownie': 'brownie'
    };
    const token = getContentToken(item.name, tokens);
    const category = String(item.category || '').trim().toLowerCase();
    return {
      category: currentLanguage === 'vi' ? translate(`category.${category}`, item.category) : item.category,
      description: currentLanguage === 'vi' && token
        ? translate(`menu.vi.${token}`, item.description)
        : item.description
    };
  }

  function localizeDeal(deal) {
    const tokens = {
      'double down deal': 'doubleDownDeal', 'loyalty bonus': 'loyaltyBonus',
      'free fries friday': 'freeFriesFriday', 'app exclusive': 'appExclusive', 'combo king': 'comboKing'
    };
    const offerTokens = {
      doubleDownDeal: 'doubleDown', loyaltyBonus: 'points', freeFriesFriday: 'fries',
      appExclusive: 'app', comboKing: 'combo'
    };
    const tagTokens = {
      '🔥 flash sale': 'flash', '👑 members': 'members', '🍟 weekly': 'weekly',
      '📱 app only': 'app', '🍔 value': 'value'
    };
    const title = deal.title || deal.name || '';
    const token = getContentToken(title, tokens);
    const tag = deal.tag || '';
    const tagToken = getContentToken(tag, tagTokens);
    if (currentLanguage !== 'vi') return { title, offer: deal.offer || deal.description || '', tag };
    return {
      title: token ? translate(`deal.vi.${token}`, title) : title,
      offer: token ? translate(`deal.viOffer.${offerTokens[token]}`, deal.offer || deal.description || '') : deal.offer || deal.description || '',
      tag: tagToken ? translate(`deal.viTag.${tagToken}`, tag) : tag
    };
  }

  function localizeFeature(feature) {
    const keys = {
      'drive-thru': 'feature.driveThru', 'delivery': 'feature.delivery',
      'dine-in': 'feature.dineIn', '24h': 'feature.open24'
    };
    const key = keys[String(feature || '').toLowerCase()];
    return key ? translate(key, feature) : feature;
  }

  function localizeHours(hours) {
    if (currentLanguage !== 'vi' || !hours) return hours;
    return String(hours)
      .replace(/^Open 24hrs$/i, translate('feature.hours'))
      .replace(/^Open\s*·\s*Closes\s*/i, `${translate('feature.open')} · ${translate('feature.closes')} `)
      .replace(/^Open now$/i, translate('feature.openNow'))
      .replace(/^Closed$/i, translate('feature.closed'));
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('#language-toggle')) {
      setLanguage(currentLanguage === 'en' ? 'vi' : 'en');
    }
  });

  window.BK_I18N = {
    t: translate,
    getLanguage: () => currentLanguage,
    apply: applyTranslations,
    localizeMenuItem,
    localizeDeal,
    localizeFeature,
    localizeHours
  };
  applyTranslations();
})();
