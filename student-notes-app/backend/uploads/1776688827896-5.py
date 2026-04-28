a = int(input("Enter first angle: "))
b = int(input("Enter second angle: "))
c = int(input("Enter third angle: "))

if a > 0 and b > 0 and c > 0 and (a + b + c) == 180:
    print("Triangle is valid")

    if a==b==c:
        print("It is an equilateral triangle")

    elif a == 90 or b == 90 or c == 90:
        print("It is right-angled triangle")

    elif a > 90 or b > 90 or c > 90:
        print("It is an obtuse triangle")

    else:
        print("It is an acute triangle")

else:
    print("Triangle is not valid")