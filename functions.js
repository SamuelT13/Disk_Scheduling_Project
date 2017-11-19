var words = [ ];
var block = 0, raid = 0, cap = 0, disks = 0, algo = -1;
var colors = ["white", "red", "blue", "yellow", "green", "purple", "orange", "pink"];
var algo_name = ["Random", "FIFO", "LIFO", "SSTF", "SCAN", "C-SCAN", "C-LOOK", "S-LOOK"];
var c = 0;
var data_disks;
var data = [ ];
var free_blocks = [ ];
var seek_ave;
var read = [ ];
var trav, total;
var used_blocks = [ ];
var ind, ind_w;
var disk_head;
var dir; // 0 is down; 1 is up

alert("Hello!");

$(document).ready(main);

function main(){        
    disk_config_hide();
    progress_hide();
    space_hide();
    write_hide();
    read_hide();
    $("#success").hide();
    
    seek_ave = 0;
    
    $("#uprm").click(function(){$("#depende1")[0].play();});
    $("#onion").click(function(){$("#depende2")[0].play();});
    
    $("#button_disk_config").click(function(){
        disk_config_show();
        write_hide();
        read_hide();
    });
    
    $("#cancel_disk_config").click(function(){
        location.reload();
        disk_config_hide();
    });
    
    $("#input_enter").click(function(){
        add_word();
    });
    $("#read_enter").click(function(){
        read_word();
    });
}

function get_raid(){
    var sr=document.getElementById("select_raid");
    var raid = sr.options[sr.selectedIndex].value;
    return(parseInt(raid));
}

function get_cap(){
    var sr=document.getElementById("select_cap");
    var cap = sr.options[sr.selectedIndex].value;
    return(parseInt(cap));
}

function get_disks(){
    var sr=document.getElementById("select_disk");
    var disks = sr.options[sr.selectedIndex].value;
    return(parseInt(disks));
}

function get_block(){
    var sr=document.getElementById("select_block");
    var block = sr.options[sr.selectedIndex].value;
    return(parseInt(block));
}

function fill_raid(raid, cap, disks, block){
    document.getElementById("block_s").innerHTML = block.toString() + " GB";
    document.getElementById("block_d").innerHTML = (cap/disks/block).toString() + " Blocks";
    var disk_b = cap/disks/block;
    data = [ ]; free_blocks = [ ];
    
    switch(raid){
        case 0:
            data_disks = disks;
            for (var i = 0; i < data_disks; i++)
                    free_blocks.push([ ]);
            
            for (var i = 1; i <= disks; i++){ 
                var s = "p_"+i.toString();
                $("#d_"+i.toString()).show();
                $("#"+s).show();  
                
                document.getElementById(s).innerHTML="Only\nData";
        
                data.push(cap/disks);
                
                for (var j = 0; j < disk_b; j++)
                    free_blocks[i-1].push(j);
            }
            
            for (var i = disks+1; i <= 8; i++){
                var s = "p_"+i.toString();
                $("#d_"+i.toString()).hide();
                $("#"+s).hide();  
            }
            
            document.getElementById("data").innerHTML = cap.toString() + " GB";
            document.getElementById("parity").innerHTML = "0 GB";
            document.getElementById("total").innerHTML = cap.toString() + " GB";
            document.getElementById("toler").innerHTML = "0 Disks";
            document.getElementById("cate").innerHTML = "Striping";
            break;
            
        case 1:
            data_disks = disks/2;
            for (var i = 0; i < data_disks; i++)
                    free_blocks.push([ ]);
            
            for (var i = 1; i <= disks; i++){ 
                var s = "p_"+i.toString();
                $("#d_"+i.toString()).show();
                $("#"+s).show();  
                
                if (i <= disks/2){ 
                    document.getElementById(s).innerHTML="Only\nData";
                    data.push(cap/disks);
                    
                    for (var j = 0; j < disk_b; j++)
                        free_blocks[i-1].push(j);
                }
                
                else document.getElementById(s).innerHTML="Only\nParity";
            }
    
            for (var i = disks+1; i <= 8; i++){
                var s = "p_"+i.toString();
                $("#d_"+i.toString()).hide();
                $("#"+s).hide();  
            }
            
            document.getElementById("data").innerHTML = (cap/2).toString() + " GB";
            document.getElementById("parity").innerHTML = (cap/2).toString() + " GB";
            document.getElementById("total").innerHTML = cap.toString() + " GB";
            document.getElementById("toler").innerHTML = "1 Disk";
            document.getElementById("cate").innerHTML = "Mirroring";
            break;
        
        case 2:
            data_disks = disks-Math.ceil(Math.log(disks)/Math.log(2));
            for (var i = 0; i < data_disks; i++)
                free_blocks.push([ ]);
            
            for (var i = 1; i <= disks; i++){ 
                var s = "p_"+i.toString();
                $("#d_"+i.toString()).show();
                $("#"+s).show();  
                
                if (i <= disks-Math.ceil(Math.log(disks)/Math.log(2))){ 
                    document.getElementById(s).innerHTML="Only\nData";
                    data.push(cap/disks);
                    
                    for (var j = 0; j < disk_b; j++)
                        free_blocks[i-1].push(j);
                }
                
                else document.getElementById(s).innerHTML="Only\nParity";
            }
    
            for (var i = disks+1; i <= 8; i++){
                var s = "p_"+i.toString();
                $("#d_"+i.toString()).hide();
                $("#"+s).hide();  
            }
            
            document.getElementById("data").innerHTML = (cap/disks*(disks-Math.ceil(Math.log(disks)/Math.log(2)))).toString() + " GB";
            document.getElementById("parity").innerHTML = (cap/disks*Math.ceil(Math.log(disks)/Math.log(2))).toString() + " GB";
            document.getElementById("total").innerHTML = cap.toString() + " GB";
            document.getElementById("toler").innerHTML = "1 Disk";
            document.getElementById("cate").innerHTML = "Parallel Access";
            break;
            
        case 3:
            data_disks = disks-1;
            for (var i = 0; i < data_disks; i++)
                free_blocks.push([ ]);
            
            for (var i = 1; i <= disks; i++){ 
                var s = "p_"+i.toString();
                $("#d_"+i.toString()).show();
                $("#"+s).show();  
                
                if (i <= disks - 1){ 
                    document.getElementById(s).innerHTML="Only\nData";
                    data.push(cap/disks);
                    
                    for (var j = 0; j < disk_b; j++)
                        free_blocks[i-1].push(j);
                }
                
                else document.getElementById(s).innerHTML="Only\nParity";
            }
    
            for (var i = disks+1; i <= 8; i++){
                var s = "p_"+i.toString();
                $("#d_"+i.toString()).hide();
                $("#"+s).hide();  
            }
            
            if ((cap*(disks-1))%disks == 0) document.getElementById("data").innerHTML = (cap * (disks - 1)/ disks).toString() + " GB";
            else document.getElementById("data").innerHTML = (cap * (disks - 1)/ disks).toFixed(2).toString() + " GB";
            if (cap % disks == 0) document.getElementById("parity").innerHTML = (cap / disks).toString() + " GB";
            else document.getElementById("parity").innerHTML = (cap / disks).toFixed(2).toString() + " GB";
            document.getElementById("total").innerHTML = cap.toString() + " GB";
            document.getElementById("toler").innerHTML = "1 Disk";
            document.getElementById("cate").innerHTML = "Parallel Access";
            break;
            
        case 4:
            data_disks = disks-1;
            for (var i = 0; i < data_disks; i++)
                free_blocks.push([ ]);
            
            for (var i = 1; i <= disks; i++){ 
                var s = "p_"+i.toString();
                $("#d_"+i.toString()).show();
                $("#"+s).show();  
                
                if (i <= disks - 1){ 
                    document.getElementById(s).innerHTML="Only\nData";
                    data.push(cap/disks);

                    for (var j = 0; j < disk_b; j++)
                        free_blocks[i-1].push(j);
                }
                
                else document.getElementById(s).innerHTML="Only\nParity";
            }
    
            for (var i = disks+1; i <= 8; i++){
                var s = "p_"+i.toString();
                $("#d_"+i.toString()).hide();
                $("#"+s).hide();  
            }
            
            document.getElementById("data").innerHTML = (cap * (disks - 1)/ disks).toString() + " GB";
            document.getElementById("parity").innerHTML = (cap / disks).toString() + " GB";
            document.getElementById("total").innerHTML = cap.toString() + " GB";
            document.getElementById("toler").innerHTML = "1 Disk";
            document.getElementById("cate").innerHTML = "Indepedent Access";
            break;
            
        case 5:
            data_disks = disks;
            for (var i = 0; i < data_disks; i++)
                free_blocks.push([ ]);
            
            for (var i = 1; i <= disks; i++){ 
                var s = "p_"+i.toString();
                $("#d_"+i.toString()).show();
                $("#"+s).show();  
                document.getElementById(s).innerHTML="Data &\n Parity";
                 
                data.push((cap/disks) * (disks-1)/disks); 
                
                var exc = disk_b/disks;
                
                for (var j = 0; j < disk_b; j++)
                    if (j < (disks-i)*exc || j >= (disks-i+1)*exc)
                        free_blocks[i-1].push(j);
            }
    
            for (var i = disks+1; i <= 8; i++){
                var s = "p_"+i.toString();
                $("#d_"+i.toString()).hide();
                $("#"+s).hide();  
            }
                    
            document.getElementById("data").innerHTML = (cap/disks*(disks-1)).toString() + " GB";
            document.getElementById("parity").innerHTML = (cap/disks).toString() + " GB";
            document.getElementById("total").innerHTML = cap.toString() + " GB";
            document.getElementById("toler").innerHTML = "1 Disk";
            document.getElementById("cate").innerHTML = "Indepedent Access";
            break;  
            
        case 6:
            data_disks = disks;
            for (var i = 0; i < data_disks; i++)
                free_blocks.push([ ]);
            
            for (var i = 1; i <= disks; i++){ 
                var s = "p_"+i.toString();
                $("#d_"+i.toString()).show();
                $("#"+s).show();  
                document.getElementById(s).innerHTML="Data &\n Parity";
                
                data.push((cap/disks) * (disks-2)/disks);
                
                var exc = disk_b/disks;
                    
                for (var j = 0; j < disk_b; j++){
                    if (i == 1 && j < (disks-2)*exc-1) free_blocks[i-1].push(j);
                    else if (i != disks && (j < ((disks-1-i)*exc-1) || j >= (disks-i+1)*exc)) free_blocks[i-1].push(j);
                    else if (i == disks && (j >= (disks-i+1)*exc && j <= Math.floor((disks-1)*exc))) free_blocks[i-1].push(j);
                }
            }
    
            for (var i = disks+1; i <= 8; i++){
                var s = "p_"+i.toString();
                $("#d_"+i.toString()).hide();
                $("#"+s).hide();  
            }
            document.getElementById("data").innerHTML = (cap/disks*(disks-2)).toString() + " GB";
            document.getElementById("parity").innerHTML = (cap/disks*2).toString() + " GB";
            document.getElementById("total").innerHTML = cap.toString() + " GB";
            document.getElementById("toler").innerHTML = "2 Disks";
            document.getElementById("cate").innerHTML = "Indepedent Access";
            break; 
    }
    space_hide();
    space_show();
    ind = 0;
    
    for (var i = 0; i < data_disks; i++){
        while (free_blocks[i].length*block > data[i]) free_blocks[i].pop();
        while ((free_blocks[i].length+1)*block <= data[i])
            for (var j = disk_b-1; j >= 0; j--)
                if (free_blocks[i].indexOf(j) == -1){
                    free_blocks[i].push(j);
                    break;
                }
    }
}

function get_algo(){
    var sr=document.getElementById("select_algo");
    var algo = sr.options[sr.selectedIndex].value;
    return(parseInt(algo));
}

function KeyPress(event){
  if (event.keyCode === 13) add_word();
}

function KeyPressRead(event){
  if (event.keyCode === 13) read_word();
}

function KeyPressReload(event){
    if (event.keyCode === 13) location.reload();
}

function read_word(){
    var s = $("#word_read")[0].value;
    $("#word_read")[0].value = "";
    
    var sum = 0;
    for (var i = 0; i < words.length; i++)
        if (read[i] != 0) break;
    
    if (s.toString() == "") return;
    ind_w = words.indexOf(s);

    if (ind_w == -1){
        alert("Word to read is not on disk memory.");
        return;
    }
    //else if (read[ind_w] == 1){
    //    alert("Word has already been read from disk.");
    //    return;
    //}
    
    if (i == words.length){
        disk_head = 0;
        $("#rcol")[0].innerHTML = algo_name[algo]; 
        trav = 0; total = 0;
    }
    
    read_show();
    $("#read_table> tbody").append("<tr style=\"background-color: darkgreen; \"><td id=\"test2\"  colspan = \"3\" style=\"font-size: 24px;\">" + s + "</td></tr>");
    
    if (algo == 0){
        read[ind_w] = 1;
        RANDOM(s, used_blocks[ind_w], 0, used_blocks[ind_w].length);
    }
    
    if (algo == 1){
        read[ind_w] = 1;
        FIFO(s, used_blocks[ind_w], 0, used_blocks[ind_w].length);
    }
    
    if (algo == 2){
        read[ind_w] = 1;
        LIFO(s, used_blocks[ind_w], used_blocks[ind_w].length, 0);
    }
    
    if (algo == 3){
        read[ind_w] = 1;
        SSTF(s, used_blocks[ind_w], 0, used_blocks[ind_w].length/2);
        SSTF(s, used_blocks[ind_w], used_blocks[ind_w].length/2, used_blocks[ind_w].length);
    }
    
    if (algo == 4){
        read[ind_w] = 1;
        SCAN(dir, s, used_blocks[ind_w], 0, used_blocks[ind_w].length/2);
        SCAN(dir, s, used_blocks[ind_w], used_blocks[ind_w].length/2, used_blocks[ind_w].length);
    }
    
    if (algo == 5){
        read[ind_w] = 1;
        CSCAN(dir, s, used_blocks[ind_w], 0, used_blocks[ind_w].length/2);
        CSCAN(dir, s, used_blocks[ind_w], used_blocks[ind_w].length/2, used_blocks[ind_w].length);
    }
    
    if (algo == 6){
        read[ind_w] = 1;
        CSCAN(dir, s, used_blocks[ind_w], 0, used_blocks[ind_w].length);
    }
    
    if (algo == 7){
        read[ind_w] = 1;
        SSTF(s, used_blocks[ind_w], 0, used_blocks[ind_w].length);
    }
    
    seek_ave = trav;
    document.getElementById("read2").innerHTML = "Total Seek Length: " + seek_ave.toString();
}   
    
function RANDOM(w, used, start, end){
    start = Math.floor(start);
    end = Math.floor(end);
    total += end-start;
    
    var r, found = [ ];
    
    for (var i = start; i < end; i++) found[i] = 0;
    
    if (start == end) return;
    
    for (var i = start; i < end; i++){
        r = Math.floor(Math.random()*end);
        
        if (found[r] == 1){
            i--;
            continue;
        }
        
        $("#read_table > tbody").append("<tr style=\"font-size: 22px;\"><td id=\"word1\">" + w[r] + "</td>"+"<td id = \"word1\">" + used[r].toString() + " </td>" +"<td id = \"word1\">" + Math.abs(disk_head - used[r]).toString() + " </td>" +"</tr>");

        trav += Math.abs(disk_head-used[r]);
        disk_head = used[r];
        found[r] = 1;
    }
}

function FIFO(w, used, start, end){
    start = Math.floor(start);
    end = Math.floor(end);
    total += (end-start);
    
    if (start == end) return;
    
    for (var i = start; i < end; i++){
        $("#read_table > tbody").append("<tr style=\"font-size: 22px;\"><td id=\"word1\">" + w[i] + "</td>"+"<td id = \"word1\">" + used[i].toString() + " </td>" +"<td id = \"word1\">" + Math.abs(disk_head - used[i]).toString() + " </td>" +"</tr>");

        trav += Math.abs(disk_head-used[i]);
        disk_head = used[i];
    }
}

function LIFO(w, used, start, end){
    start = Math.floor(start);
    end = Math.floor(end);
    total += (end-start);
    
    if (start == end) return;
    
    for (var i = start-1; i >= end; i--){
        $("#read_table > tbody").append("<tr style=\"font-size: 22px;\"><td id=\"word1\">" + w[i] + "</td>"+"<td id = \"word1\">" + used[i].toString() + " </td>" +"<td id = \"word1\">" + Math.abs(disk_head - used[i]).toString() + " </td>" +"</tr>");

        trav += Math.abs(disk_head-used[i]);
        disk_head = used[i];
    }
}
    
function SSTF(w, used, start, end){
    start = Math.floor(start);
    end = Math.floor(end);
    total += end-start;
    
    var m, r, found = [ ];
    
    for (var i = start; i < end; i++) found[i] = 0;
    
    if (start == end) return;
    
    for (var i = start; i < end; i++){
        m = -1;
        
        for (var j = start; j < end; j++)
            if (found[j] == 0 && (m == -1 || Math.abs(disk_head - used[j]) < m)){
                m = Math.abs(disk_head - used[j]);
                r = j;
            }
        
        $("#read_table > tbody").append("<tr style=\"font-size: 22px;\"><td id=\"word1\">" + w[r] + "</td>"+"<td id = \"word1\">" + used[r].toString() + " </td>" +"<td id = \"word1\">" + Math.abs(disk_head - used[r]).toString() + " </td>" +"</tr>");

        trav += Math.abs(disk_head-used[r]);
        disk_head = used[r];
        found[r] = 1;
    }
}

function SCAN(d, w, used, start, end){
    start = Math.floor(start);
    end = Math.floor(end);
    total += end-start;
    
    var m, r, found = [ ];
    
    for (var i = start; i < end; i++) found[i] = 0;
    
    if (start == end) return;
    
    for (var i = start; i < end; i++){
        m = -1;
        
        if (d == 0){
            for (var j = start; j < end; j++)
                if (found[j] == 0 && (disk_head >= used[j]) && (m == -1 || Math.abs(disk_head - used[j]) < m)){
                    m = Math.abs(disk_head - used[j]);
                    r = j;
                }
            if (m == -1){
                d = 1;
                dir = 1;
                i--;
                continue;
            }
        }
        
        else{
            for (var j = start; j < end; j++)
                if (found[j] == 0 && (disk_head <= used[j]) && (m == -1 || Math.abs(disk_head - used[j]) < m)){
                    m = Math.abs(disk_head - used[j]);
                    r = j;
                }
            if (m == -1){
                d = 0;
                dir = 0;
                i--;
                continue;
            }
        }
        
        $("#read_table > tbody").append("<tr style=\"font-size: 22px;\"><td id=\"word1\">" + w[r] + "</td>"+"<td id = \"word1\">" + used[r].toString() + " </td>" +"<td id = \"word1\">" + Math.abs(disk_head - used[r]).toString() + " </td>" +"</tr>");

        trav += Math.abs(disk_head-used[r]);
        disk_head = used[r];
        found[r] = 1;
    }
}

function CSCAN(d, w, used, start, end){
    start = Math.floor(start);
    end = Math.floor(end);
    total += end-start;
    
    var m, r, found = [ ];
    
    for (var i = start; i < end; i++) found[i] = 0;
    
    if (start == end) return;
    
    for (var i = start; i < end; i++){
        m = -1;
        
        if (d == 0){
            for (var j = start; j < end; j++)
                if (found[j] == 0 && (m == -1 || used[j] < m)){
                    m = used[j];
                    r = j;
                }
            
            d = 1;
            dir = 1;
        }
        
        else{
            for (var j = start; j < end; j++)
                if (found[j] == 0 && (disk_head <= used[j]) && (m == -1 || Math.abs(disk_head - used[j]) < m)){
                    m = Math.abs(disk_head - used[j]);
                    r = j;
                }
            if (m == -1){
                d = 0;
                i--;
                continue;
            }
        }
        
        $("#read_table > tbody").append("<tr style=\"font-size: 22px;\"><td id=\"word1\">" + w[r] + "</td>"+"<td id = \"word1\">" + used[r].toString() + " </td>" +"<td id = \"word1\">" + Math.abs(disk_head - used[r]).toString() + " </td>" +"</tr>");

        trav += Math.abs(disk_head-used[r]);
        disk_head = used[r];
        found[r] = 1;
    }
}

function EnterPress(event){
  if (event.keyCode === 13) ;
}

function add_word(){
    var s = $("#word_input")[0].value;
    $("#word_input")[0].value = "";
    
    if (s.toString() == "") return;

    if (words.indexOf(s) != -1){
        alert("Word to add is already on disk memory.");
        return;
    }
    
    var sum = 0;
    for (var j = 0; j < data_disks; j++) sum += free_blocks[j].length;
    
    if (sum < s.length){
        alert("No sufficient space left on disk memory!");
        return 0;
    }
    
    words.push(s);
    read.push(0);
    used_blocks.push([ ]);
    
    if (words.length == 1){
        var s = "<div class=\"box\" id=\"word_title\">Word List <br /> [block number]</div>";  
        $("#word_list").append(s);
        $("#data_transfer_read").fadeIn(400);
    }
    
    print_words();
}

function print_words(){
    var name = words.length.toString();
    var s = "<div class=\"box\" id=\"" + name + "\"></div>";
    
    $("#word_list").append(s);
    var div = document.getElementById(name);
    
   var t = "<div class=\"box_w\" id=\"w" + name + "\"></div>";
    
    $("#"+name).append(t);
    var div2 = document.getElementById("w"+name);
    div2.innerHTML = div2.innerHTML + words[words.length-1] + "<hr style = \"margin:0px\">";
    
    var v = "<div class=\"box_b\" id=\"b" + name + "\"></div>";
    $("#"+name).append(v);

    var l, min;
    
    for (var i = 0; i < words[words.length-1].length; i++){
        l = "<div class=\"box_l\" id=\"" + name + "l" + i.toString() + "\"></div>";   
        $("#b"+name).append(l);

        while (free_blocks[ind].length == 0)
            ind = (ind+1)%data_disks;
        
        
        document.getElementById(name+"l"+ i.toString()).innerHTML = words[words.length-1][i] + "<br /> " + free_blocks[ind][0].toString(); 
        
        used_blocks[words.length-1].push(free_blocks[ind][0]);
        
        data[ind] -= block;
        space_show();
        
        c = ind;
        free_blocks[ind].reverse();
        free_blocks[ind].pop();
        free_blocks[ind].reverse();
            
        $("#"+name+"l"+i.toString()).css("color", colors[c]);
        ind = (ind+1)%data_disks;
    }
    
    $("#progress3").show();
}

function space_show(){
    for (var i = 1; i <= data_disks; i++){ 
        var s = "p_i_"+i.toString();
        $("#d_i_"+i.toString()).fadeIn(400);
        $("#"+s).show();  
        document.getElementById(s).innerHTML= data[i-1].toString() + " GB";
    }
}

function space_hide(){
  for (var i = 1; i <= 8; i++){ 
        var s = "p_i_"+i.toString();
        $("#d_i_"+i.toString()).hide();
        $("#"+s).hide();  
    }
}

function write_show(){
    $("#transfer").fadeIn(400);
}

function read_show(){
    $("#read_table").fadeIn(400);
    $("#read2").show();
    $("#data_transfer_read").show();
}

function write_hide(){
    $("#transfer").hide();
}

function read_hide(){
    $("#read_table").hide();
    $("#read2").hide();
    $("#data_transfer_read").hide();
}

function disk_config_show(){
    var p_raid = raid;
    var p_cap = cap;
    var p_disks = disks;
    var p_block = block;

    raid = get_raid();
    cap = get_cap();
    disks = get_disks();    
    block = get_block();
    
    if (raid == -1){alert("No RAID Level entered."); return;}
    if (cap == 0){alert("No Capacity entered."); return;}
    if (disks == 0){alert("No Disk Amount entered."); return;}
    if (block == 0){alert("No Block Size entered."); return;}
    if (disks == 2 && raid == 6){alert("RAID 6 must have more than 2 disks."); return;}
    
    $("#disk-space").hide();
    $("#disk-space").fadeIn(800);
    $("#disk-info").show();
    $("#progress1").show();
    
    if (raid != p_raid || cap != p_cap || disks != p_disks || block != p_block){
        words = [ ]; //for (var i = 0; i < words.length; i++) words[i] = "";
        dir = 1; //increasing direction again
        disk_head = 0; //disk head 0 again
        trav = 0; total = 0; //no blocks travelled/total
        seek_ave = 0; //no seek length
        for (var i = 0; i < read.length; i++) read[i]= 0; //no words read
        used_blocks = [ ]; //no blocks in use
        $("#read_table tbody tr").remove();
        read_hide();
        if (words.length != 0) $("#data_transfer_read").show();
    }
    
    fill_raid(raid, cap, disks, block);

    $("#word_list").empty();
            
    document.getElementById("dis_text").id="dis_change";   
    document.getElementById("dis_change").innerHTML="Enter";

    if($("#dis_change").length != 0){
        $("#dis_change").click(function(){
            var p_algo = algo;
            algo = get_algo();
    
            if (algo != -1){
                var sr=document.getElementById("select_algo");
                var a1 = sr.options[sr.selectedIndex].text;
                document.getElementById("choice").innerHTML= a1;
                
                $("success").fadeOut(800);
                $("#success").fadeIn(800);
                $("#progress2").show();
                
                if (p_algo != algo){
                    dir = 1; //increasing direction again
                    disk_head = 0; //disk head 0 again
                    trav = 0; total = 0; //no blocks travelled/total
                    seek_ave = 0; //no seek length
                    for (var i = 0; i < read.length; i++) read[i]= 0; //no words read
                    $("#read_table tbody tr").remove();
                    read_hide();
                    if (words.length != 0) $("#data_transfer_read").show();
                }
                write_show();
            }
            else{
                alert("Choose a valid algorithm!");
                $("#success").hide(); $("#progress2").hide();
                dir = 1; //increasing direction again
                disk_head = 0; //disk head 0 again
                trav = 0; total = 0; //no blocks travelled/total
                seek_ave = 0; //no seek length
                for (var i = 0; i < read.length; i++) read[i]= 0; //no words read
                $("#read_table tbody tr").remove();
                read_hide();
            }
        });
    }
}


function disk_config_hide(){
    $("#disk-space").hide();
    $("#disk-info").hide();
    progress_hide();
    $("#success").hide();
    
    if($("#dis_change").length != 0){
        document.getElementById("dis_change").id="dis_text";   
        document.getElementById("dis_text").innerHTML="Disabled";
    }
}

function progress_hide(){
    $("#progress1").hide();
    $("#progress2").hide();
    $("#progress3").hide();
}
