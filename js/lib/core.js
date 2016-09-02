var COREOBJ = {
	util: {
		replaceAsterisk(str){
			if (!str) return '';
			if (str.length <= 8) return str;
			str = str.trim();
			var l = str.length,
				aLen = new Array(l-7).join('*');
			return str.replace(str.substr(4, (l-7)), aLen);
		}
	},
	url: {
        queryString: function (key, url) {
            url = url || location.href;
            var reg = new RegExp('[?&#]' + key + '=([^&#]*)',"i");
            var match = url.match(reg);
            if (match) {
                try {
                    return decodeURIComponent(match[1])||"";
                } catch (e) {
                }
            }
            return "";
        },
        addParameter: function (url,key, value) {
            url = url || location.href;
            if (url.indexOf("?") == -1) url += "?";
            if (url.indexOf(key + "=") == -1) {
                return url + '&' + key + "=" + encodeURIComponent(value);
            } else {
                return url.replace(new RegExp("([?&])" + key + "=[^&]*"), "$1" + key + "=" + encodeURIComponent(value));
            }
        },
        appendHash: function (key, value) {
            var hash = window.location.hash;
            hash = hash.indexOf("#") < 0 ? "#" + hash : hash;

            if (hash.indexOf(key + "=") == -1) {
                hash =  hash + '&' + key + "=" + encodeURIComponent(value);
            } else {
                hash = hash.replace(new RegExp("([?&])" + key + "=[^&]*"), "$1" + key + "=" + encodeURIComponent(value));
            }
            window.location.hash = hash;
        }
    },
    cookie: {
        get: function (name) {
            var cookie = document.cookie,
                cookieName = encodeURIComponent(name) + '=',
                start = cookie.indexOf(cookieName),
                value = null;

            if (start > -1) {
                var cookieEnd = document.cookie.indexOf(';', start);
                if (cookieEnd == -1) {
                    cookieEnd = document.cookie.length;
                }
                value = decodeURIComponent(document.cookie.substring(start + cookieName.length, cookieEnd));
            }

            return value;
        },
        set: function (name, value, expires, path, domain, secure) {
            var text = encodeURIComponent(name) + '=' + encodeURIComponent(value);

            if (expires instanceof Date) {
                text += ';expires=' + expires.toGMTString();
            } else if (typeof expires === "number") {
                text += ';expires=' + new Date(expires).toGMTString();
            }
            if (path) {
                text += ';path=' + path;
            }
            if (domain) {
                text += ';domain=' + domain;
            }
            if (secure) {
                text += ';secure';
            }
            document.cookie = text;
        },
        unset: function (name, path, domain, secure) {
            this.set(name, '', new Date(0), path, domain, secure);
        }
    },
    date: {
    	formatDate: function (format, date) {
	        if (!date) return "";
	        if (typeof date == "number") date = new Date(date * 1000);
	        var o = {
	            "M+": date.getMonth() + 1, //month
	            "d+": date.getDate(),    //day
	            "h+": date.getHours(),   //hour
	            "m+": date.getMinutes(), //minute
	            "s+": date.getSeconds(), //second
	            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
	            "S": date.getMilliseconds(), //millisecond
	            "w": "日一二三四五六".charAt(date.getDay())
	        }
	        format = format.replace(/y{4}/, date.getFullYear())
	        .replace(/y{2}/, date.getFullYear().toString().substring(2))

	        for (var k in o) {
	            var reg = new RegExp(k);
	            format = format.replace(reg, match);
	        }
	        function match(m) {
	            return m.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length);
	        }
	        return format;
	    }
    },
    price: {
    	changeToYuan: function(price) {
    		//价格将分转换为元
			if (price && isFinite(price) && !isNaN(price)) {
				return (price / 100).toFixed(2);
			}
			return price;
		}
    },
    validate: {
    	isValidID : function(num) {
    		num = num.toUpperCase();
	        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
	        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)))
	        {
	            return false;
	        }
	        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
	        //下面分别分析出生日期和校验位
	        var len, re;
	        len = num.length;
	        if (len == 15)
	        {
	            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
	            var arrSplit = num.match(re);

	            //检查生日日期是否正确
	            var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
	            var bGoodDay;
	            bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
	            if (!bGoodDay)
	            {
	                return false;
	            }
	            else
	            {
	                    //将15位身份证转成18位
	                    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
	                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
	                    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
	                    var nTemp = 0, i;
	                    num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
	                    for(i = 0; i < 17; i ++)
	                    {
	                        nTemp += num.substr(i, 1) * arrInt[i];
	                    }
	                    num += arrCh[nTemp % 11];
	                    return true;
	            }
	        }
	        if (len == 18)
	        {
	            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
	            var arrSplit = num.match(re);

	            //检查生日日期是否正确
	            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
	            var bGoodDay;
	            bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
	            if (!bGoodDay)
	            {
	                return false;
	            }
		        else
		        {
		            //检验18位身份证的校验码是否正确。
		            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
		            var valnum;
		            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
		            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
		            var nTemp = 0, i; 
		            for(i = 0; i < 17; i ++)
		            {
		                nTemp += num.substr(i, 1) * arrInt[i];
		            }
		            valnum = arrCh[nTemp % 11];
		            if (valnum != num.substr(17, 1))
		            {
		                return false;
		            }
		            return true;
		        }
	        }
	        return false;
	    },
	    isBankCard : function(cardNum) {
	    	//参考https://zhuanlan.zhihu.com/p/21399490?refer=mrcolin  
	        var sumOdd = 0;
	        var sumEven = 0;
	        var wei = cardNum.split('').reverse();
	        var length = wei.length;
	        var i;

	        // 转换为数值
	        for (i=0; i<length; i++) {
	            wei[i] = Number( wei[i] );
	        }

	        for (i=0; (2*i) < length; i++) {
	            sumOdd += wei[ 2*i ];
	        }

	        for (i=0; (2 * i + 1) < length; i++) {
	            if ( (wei[2 * i + 1] * 2) > 9 ) {
	                wei[2 * i + 1] = wei[2 * i + 1] * 2 - 9;
	            }
	            else {
	                wei[2 * i + 1] *= 2;
	            }
	            sumEven += wei[2 * i + 1];
	        }

	        if ((sumOdd + sumEven) % 10 == 0) {
	            return true;
	        }
	        else {
	            return false;
	        }
	    }
    }
}
