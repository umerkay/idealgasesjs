import math


arr1 = [0,2,4]
arr2 = [0,0,5]

res = [0] * (len(arr1))

for i in range(len(arr1) - 1, -1, -1):
    res2 = []
    for j in range(len(arr1) - 1, -1, -1):

    prod = arr1[i] * arr2[i]
    res[i] += prod % 10

    print(res)

    if(prod >= 10):
        res[i-1] += math.floor(prod / 10)

print(res)