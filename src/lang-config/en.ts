export const en = {
  en: {
    translation: {
      table: {
        'title': 'Title',
        'category': 'Category',
        'date': 'Date',
        'amount': 'Amount',
        'index': 'Index',
        'comment': 'Comment',
        'total': 'Total',

        pcs: 'pcs.',
        gram: 'g.',
        ozt: 'oz t.',

        'prev': 'Previous',
        'next': 'Next',
        'trans': 'expenses',
        'invests': 'investments',
        'sorry': 'Sorry, but you don\'t have',
      },
      filterHeader: {
        'new': 'New',
        'searchHere': 'Search here',
      },
      modal: {
        'save': 'Save',
        'delete': 'Delete',
        'edit': 'Edit',
        'cancel': 'Cancel',
        'investmentType': 'Investment Type',
      },
      stat: {
        'buyingText' : `
            <p>Za kwotę: <b>{{total}}$</b> kupimy tyle co w <b>{{period}}</b>za kwotę {{lastValue}}$</p>
            <p>Inflacja skumulowana wyniosła: <b>{{inflSum}} %</b></p>
            <p>Aby kupić tyle samo towarów należałoby wydać <b>{totalPlusInfl}$</b></p>
        `
      },
      settings: {
        settings: 'Settings',
        Profile: 'Profile',
        Auth: 'Auth',

        nickName: 'Nickname',
        email: 'Email',
        phone: 'Phone number',
        lang: 'Language',
        curr: 'Currency',
        theme: 'Theme',

        save: 'Save profile changes',
        saveAvatar: 'Save avatar',
        deleteAvatar: 'Delete avatar',
        emptyAvatarInput: 'Please, select new image',

        newPass: 'New password',
        confirmPass: 'Confirm password',
        changePass: 'Change password',
        weakPass: 'New password is\'t strong.',
        strongPass: 'Strong password',
        diffPass: 'Passwords aren\'t the same',
        successProfile: 'Profile was updated successfully',
        successAvatar: 'Avatar was updated successfully',
        successPass: 'Password was updated successfully. Please login again.',

        tooltip: `The password must have at least:
                <ul>
                  <li>8 characters</li>
                  <li>1 lowercase and uppercase letter</li>
                  <li>1 number</li>
                  <li>1 symbol</li>
                </ul>`,
      },
      invests: {
        totalStocks: 'Total stocks',
        totalCrypto: 'Total crypto',
        totalMetals: 'Total metals',
        totalOther: 'Total other',
      },
      'overview': 'Overview',
      'history': 'Portfolio history',
      'buyingPower': 'Purchasing power',
      'investOverview': 'Investments overview',
      'hello': 'Hello',
      'totalInvest': 'Total investments',
      'totalTrans': 'Total expenses',
      'recentTrans': 'Recent expenses',
      'recentCrypto': 'Recent cryptocurrencies',
      'recentStocks': 'Recent stocks',
      'recentMetals': 'Recent metals',
      'recentOther': 'Recent other investments',
      'transactions': 'Expenses',
      'basic': 'Basic investments',
      'other': 'Other investments',
      'investments': 'Investments',
      'stocks': 'Stocks',
      'crypto': 'Cryptocurrencies',
      'metals': 'Metals',
      'statistics': 'Statistics',
      'pieChart': 'Pie Chart',
      'logout': 'Logout',
      'viewProfile': 'View profile',
    },
  }
}
