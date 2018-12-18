# Traverse through all array elements 
def do_it(A):
    for i in range(len(A)):
        # Find the minimum element in remaining  
        # undone array 
        min_idx = i 
        for j in range(i+1, len(A)): 
            if A[min_idx] > A[j]: 
                mi n_idx = j 
              
        # Swap the found minimum element with  
        # the first element         
        A[i], A[min_idx] = A[min_idx], A[i]
