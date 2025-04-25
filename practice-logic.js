document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("playButton").addEventListener("click", function () {
        document.querySelector(".play-btn").style.display = "none";
        document.getElementById("gameArea").style.display = "flex";
    });

    document.getElementById("createBoxesButton").addEventListener("click", function () {
        const boxContainer = document.getElementById("boxContainer");
        boxContainer.innerHTML = "";
        const numBoxes = document.getElementById("numBoxes").value;
        const l=numBoxes;

        if (numBoxes > 0 && numBoxes <= 10) {
            for (let i = 0; i < numBoxes; i++) {
                const box = document.createElement("div");
                box.classList.add("box");
                box.setAttribute("id", `box-${i}`);
                
                boxContainer.appendChild(box);
            }
        } else {
            alert("Please enter a valid number between 1 and 10!");
        }
    });
    

    const treasures = document.querySelectorAll(".treasures img");
    treasures.forEach((item) => {
        item.addEventListener("dragstart", function (e) {
            e.dataTransfer.setData("treasure", e.target.id);
        });
    });

    const boxes = document.getElementById("boxContainer");
    boxes.addEventListener("dragover", function (e) {
        e.preventDefault();
    });

    boxes.addEventListener("drop", function (e) {
        const treasureId = e.dataTransfer.getData("treasure");
        const treasure = document.getElementById(treasureId).cloneNode(true);
        treasure.classList.add("draggable-item");

        if (e.target.classList.contains("box")) {
            e.target.innerHTML = "";
            e.target.appendChild(treasure);
        }
    });

    const weights = { gold: 10, platinum: 5, rock: 1 };

    function getWeight(boxId) {
        const box = document.getElementById(boxId);
        const treasure = box.querySelector("img");
        return weights[treasure?.id] || 0;
    }

    function getAllBoxes() {
        const numBoxes = document.getElementById("numBoxes").value;
        const boxesArray = [];

        for (let i = 0; i < numBoxes; i++) {
            const boxId = `box-${i}`;
            const weight = getWeight(boxId);
            boxesArray.push({ id: boxId, weight: weight, originalPosition: i + 1 });
        }

        return boxesArray;
    }

    async function visualMergeSort(array) {
        if (array.length < 2) return array;
    
        const mid = Math.floor(array.length / 2);
        const left = await visualMergeSort(array.slice(0, mid));
        const right = await visualMergeSort(array.slice(mid));
    
        return await visualMerge(left, right);
    }
    
    async function visualMerge(left, right) {
        const result = [];
    
        while (left.length && right.length) {
            const lBox = document.getElementById(left[0].id);
            const rBox = document.getElementById(right[0].id);
    
            lBox.classList.add("highlight");
            rBox.classList.add("highlight");
            
           
    
            await new Promise(resolve => setTimeout(resolve, 800));
    
            if (left[0].weight < right[0].weight) {
                result.push(left.shift());
            } else {
                result.push(right.shift());
            }
    
            lBox.classList.remove("highlight");
            rBox.classList.remove("highlight");
        }
    
        return result.concat(left, right);
    }
    

    async function binarySearch(sortedBoxes, target) {
        let left = 0, right = sortedBoxes.length - 1;
        let debugSteps = "";
    
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            let ind=`boss${mid}`;
            const box = document.getElementById(ind);
            box.classList.add("highlight");
    
            await new Promise(resolve => setTimeout(resolve,1000)); // Delay
    
            const weight = sortedBoxes[mid].weight;
    
            if (weight === target) {
              debugSteps += `Gold found at index ${mid+1} \n`;
               document.getElementById("resultBox").innerText = debugSteps;
               document.getElementById(ind).style.backgroundColor="green";
              // document.getElementById(ind).style.color="red";
               
                return mid;
            } else {
                box.classList.remove("highlight");
            }
    
            if (weight < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    
        debugSteps += "Gold not found.";
        document.getElementById("binaryDebugSteps").innerText = debugSteps;
        return -1;
    }
    
    

    document.getElementById("startSearchButton").addEventListener("click", async function () {
        const selectedAlgorithm = document.getElementById("algorithmSelect").value;
        const boxesArray = getAllBoxes();

        
        const target = weights.gold;

        if (selectedAlgorithm === "linear") {
            linearSearch();
            document.getElementById("binaryDebugSteps").innerText = ""; 
        } else if (selectedAlgorithm === "binary") {
          //  document.getElementById("unsortedArray").innerText = "Unsorted Array: " + JSON.stringify(boxesArray);
        const sortedBoxes = await visualMergeSort(boxesArray);
        let sb=document.getElementById('sortedboxes');
        sb.innerHTML='';
        for (var i = 0; i <sortedBoxes.length; i++) {
            const bo = document.createElement("div");
            bo.classList.add("bo");
            bo.setAttribute("id", `boss${i}`);
            bo.innerHTML=document.getElementById(sortedBoxes[i].id).innerHTML;
            
            sb.appendChild(bo);
        }

       // document.getElementById("sortedArray").innerText = "Sorted Array: " + JSON.stringify(sortedBoxes);

            const index = binarySearch(sortedBoxes, target);
        }
    });

    async function linearSearch() {
        const numBoxes = document.getElementById("numBoxes").value;
    
        for (let i = 0; i < numBoxes; i++) {
            const box = document.getElementById(`box-${i}`);
            box.classList.add("highlight");
    
            await new Promise(resolve => setTimeout(resolve, 500)); // Delay for visualization
    
            const weight = getWeight(`box-${i}`);
            if (weight === 10) {
                document.getElementById("resultBox").innerText = `Gold found in Box ${i + 1}`;
                return;
            }
    
            box.classList.remove("highlight");
        }
    
        document.getElementById("resultBox").innerText = "Gold not found.";
    }
    
});
