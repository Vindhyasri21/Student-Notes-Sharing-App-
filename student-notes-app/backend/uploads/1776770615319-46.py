
elements = tuple(map(int, input("Enter tuple elements: ").split()))

print("Tuple:", elements)

num = int(input("Enter element: "))

count = elements.count(num)

print("------------------------------------")
print("Count:", count)