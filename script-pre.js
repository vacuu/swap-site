/**
 * Description:
 * Enables the user to check for a valid siteswap it can be eather asynchronous or synchronous.
 * Multiplex is not supported yet. Maybe it will in the future. The siteswap is than displayed in the middle.
 * At the top right corner there is an info box showing additional informations to this siteswap.
 * This contains the number of objects and wheather or not the siteswap is excited or groundstate.
 * If it's excited there are also transition throws shown (for getting in and getting out).
 * The notation follows this syntax: get in throws | the state | get out throws
 * Be aware that this is only one of many possible ways to get in and out of the state / trick.
 * The main aspect is that you can change your siteswap by clicking on two throws.
 * This will change the landing beats of the two throws. The first throw will land at the second landing beat.
 * And the second throw will go to the first landing beat.
 * Therefore the state is not affected but the throws inside the pattern will change.
 *
 *
 * @link   swap-site.org or .com
 * @file   script-pre.js
 * @author Christian Graßmann
 * @since  2019-02-20T5:30
 * @licence CC Attribution-NonCommercial 4.0 International
 */

window.onload=function(){
  // RANDOM WELCOME //
  var x = document.getElementById("welcome");
  var list_welcome = ["Hey juggler, what's your pattern today?",
                      "What's your swap?","What can I do for you juggler?",
                      "We love you!"];
  x.innerHTML = list_welcome[Math.floor(Math.random()*list_welcome.length)];

  // RANDOM HINTS //
  var x = document.getElementById("hints");
  var hints_str = "<br/>Some - inputs - "
  var list_ss_asyn = ["441", "631413","8448641","77772","5551", "864","774","615",
                      "645","64613","66661","744","97531","88333","777771", "8441551",
                      "733551","8447561","9661616","9494414","55668514","88441","85561",
                      "78451","75756","85566","99444","77475"];
  var list_ss_asyn_letter = ["b1","db97531"];
  var list_ss_sync = ["(4,2x)(2x,4)","(6x,4)(4,6x)","(6,4x)(4x,6)"];
  var list_ss_sync_astrix = ["(6x,4)*"];
  // first element from asyn
  hints_str +=  list_ss_asyn.splice(Math.floor(Math.random() * list_ss_asyn.length),1);

  hints_str +=  " - " + list_ss_asyn.splice(Math.floor(Math.random() * list_ss_asyn.length),1);
  // second with letter
  hints_str += " - " + list_ss_asyn_letter.splice(Math.floor(Math.random() * list_ss_asyn_letter.length),1);
  // third sync
  hints_str += " - " + list_ss_sync.splice(Math.floor(Math.random() * list_ss_sync.length),1);
  // last astrix
  hints_str += " - " + list_ss_sync_astrix.splice(Math.floor(Math.random() * list_ss_sync_astrix.length),1);
  x.innerHTML = hints_str;
}

// cast_int
// converts char to integer
// '9' -> 9, 'a' -> 10, 'B' -> 11, ... caster to Number
function cast_int(char){
  if (/^[0-9]*$/.test(char)){
    return Number(char);
  } else if  (/^[a-z]*$/.test(char)){
    // lower case
    return Number(char.charCodeAt(0)-87);
  } else {
    // upper case
    return Number(char.charCodeAt(0)-55);
  }
}

// number_of_objects_asyn
// gives the average which is equal to the number of objects requiered to juggler.
// Since we already looked at the validness. The avg has to be a whole number.
// gets the value of the object '8448641'
// '744' -> 6, '441' -> 3, 'b1' -> 6

function number_of_objects_asyn(siteswap){
  sum = 0;
  for (var i=0; i < siteswap.length; i++){
    sum += cast_int(siteswap[i]);
  }
  return sum/siteswap.length;
}

function number_of_objects_sync(num_li){
  // [10,10]
  sum = 0;
  for (var i=0; i < num_li.length; i++){
    sum += num_li[i]
  }
  return sum/num_li.length;
}
function create_back_and_copy_button() {
  var button_container = document.getElementById("button_back_copy_container");
  var b_back = document.createElement("INPUT");
  b_back.setAttribute("type", "button");
  b_back.value = "START AGAIN";
  b_back.id = "b_back";
  b_back.onclick = function() {location.href=location.href};
  //b_back.onclick = function() {};
  button_container.appendChild(b_back);

  var b_copy = document.createElement("INPUT");
  b_copy.setAttribute("type", "button");
  b_copy.value = "COPY TEXT";
  b_copy.id = "b_copy";
  b_copy.onclick = function() {text_copy()};
  //b_back.onclick = function() {};
  button_container.appendChild(b_copy);
}

// Text COPY with  https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascriptBob
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text.value;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

function text_copy(){
  var siteswap_text = "";
  var wrapper_children = document.getElementById("wrapper").children;
  for(var i = 0; i < wrapper_children.length; i++) {
      siteswap_text += wrapper_children[i].innerHTML;
    }
  var i = 0;
  var siteswap_text_clean = "";
  while (i < siteswap_text.length){
    if(siteswap_text[i] != " "){
      siteswap_text_clean += siteswap_text[i];
    }
    i++;
  }
  copyTextToClipboard(siteswap_text_clean);
}


// asnc gets whole string
// we gets three things the ss as a string, the throw substring and the num_li
function callPage_sync(ss,char_li, num_li){
  // clear old page and set styling
  var wrapper = document.getElementById("wrapper");
  // set content to nothing
  wrapper.innerHTML = "";
  // get two buttons in the div 2do2do
  create_back_and_copy_button();
  // set styling for wrapper text-align = center;
  wrapper.style.textAlign = "center";

  //wrapper.style.backgroundColor = "#eee";
  //wrapper.style.height = "200px";
  var len = char_li.length;
  console.log('-- Sync Swap Creator --');
  //console.log('len:' + len);
  // put buttons in the wrapper with id b0, b1,b2
  for (var i=0; i < char_li.length; i += 2) {
      wrapper.appendChild(create_Syntax(' (',len));
      wrapper.appendChild(createThrowSync(char_li,i,char_li[i]));
      wrapper.appendChild(create_Syntax(',',len));
      wrapper.appendChild(createThrowSync(char_li,i+1,char_li[i+1]));
      wrapper.appendChild(create_Syntax(') ',len));
      //console.log('I do great');
    }
  //create_swap(ss);

  // create a asyn siteswap for syn pattern to get the number of objects
  var ss_fake_asyn = "";
  for (var i=0;i<num_li.length;i++){
    ss_fake_asyn += String(num_li[i]);
  }
  console.log(ss_fake_asyn);
  // getting state
  // console.log('problem here');
  // console.log('ss_fake_asyn' + ss_fake_asyn);
  // ss '(a,a)' is [10,10] in num_li
  var noo = number_of_objects_sync(num_li);
  var state_str = create_state_sync(noo,num_li);
  // console.log('Other choices:');
  // console.log('noo:' + noo);
  // console.log('ss:' + ss);
  // console.log('char_li:' + char_li);
  // console.log('num_li:' + num_li);

  // set the number of number of objects
  var info = document.getElementById('info');
  // info.innerHTML = ss&hellip; + ' holds ' + number_of_objects_asyn(ss_fake_asyn) + ' objects.';
  if (noo % 2 == 0){
    info.innerHTML = state_str + ' - ' + noo + ' objects';
} else {
  if (state_str[0] == 's') {
    info.innerHTML = state_str + ' - ' + noo + ' objects';
  } else {
  info.innerHTML = noo + ' objects - excited sync pattern<br/>' + state_str;
  }
}
}

function create_Syntax(what,len){
  var mydiv = document.createElement("div");
  mydiv.classList.add("syntax");
  mydiv.innerHTML = what;
  var fontSize;
  //console.log('which case syntax?: ' + len);
  if (len <= 6){
    fontSize = "2rem";
  } else if (len <= 10 ){
    fontSize = "1.5rem";
  } else {
    fontSize = "1rem";
  }
  mydiv.style.fontSize = fontSize;
  return mydiv;
}

swap_beat = -1;
function count_asyn(n){
  if (swap_beat == -1){
    swap_beat = n;
    console.log('global swap beat now: ' + String(n));
  } else {
    // swap
    console.log('global swap beat still: ' + String(swap_beat));
    console.log('second swap beat now: ' + String(n));
    //var swap_beat_2 = n;
    siteswap_beat = cast_int(document.getElementById("b" + String(swap_beat)).innerHTML);
    siteswap_beat2 =cast_int(document.getElementById("b" + String(n)).innerHTML);
    landing_beat = siteswap_beat + swap_beat;
    landing_beat2 = siteswap_beat2 + n;
    console.log("throw from first: " + String(siteswap_beat) + " becomes " + String(landing_beat));
    console.log("throw from second: " + String(siteswap_beat2) + " becomes " + String(landing_beat2));
    // first
    // 2do String cast to a b c
    if (landing_beat2 - swap_beat < 1 || landing_beat - n < 1){
      console.log('not swapable ... throw is needed before');
      swap_beat = -1;
      return;
    }
    document.getElementById("b" + String(swap_beat)).innerHTML = cast_string(landing_beat2 - swap_beat);
    document.getElementById("b" + String(n)).innerHTML = cast_string(landing_beat - n);
    document.getElementById("b" + String(n)).blur();
    swap_beat = -1;
  }
}

function count_sync(n){
  if (swap_beat == -1){
    swap_beat = n;
    // console.log('global swap beat sync now: ' + String(swap_beat));
  } else {
    // do swap
    swap_beat2 = n;
    // console.log('second swap beat sync: ' + String(swap_beat2));;
    // landing beats
    var content_beat = document.getElementById("b" + String(swap_beat)).innerHTML;
    var content_beat2 = document.getElementById("b" + String(swap_beat2)).innerHTML;
    var landing_beat;
    var landing_beat2;

    if (content_beat.length > 1){
      if (swap_beat % 2 == 0){
        landing_beat = cast_int(content_beat[0]) + swap_beat + 1;
        //console.log('from even beat' + content_beat[0]);
      } else {
        landing_beat = cast_int(content_beat[0]) + swap_beat - 1;
        //console.log('from odd beat' + content_beat[0]);
      }
      //console.log('beat1 has a x ' + content_beat);
    } else {
      landing_beat = cast_int(content_beat[0]) + swap_beat;
    }
    if (content_beat2.length > 1){
      if (swap_beat2 % 2 == 0){
        landing_beat2 = cast_int(content_beat2[0]) + swap_beat2 + 1;
        //console.log('from even beat' + content_beat2[0] );
      } else {
        landing_beat2 = cast_int(content_beat2[0]) + swap_beat2 - 1;
        //console.log('from odd beat' + content_beat2[0]);
      }
      //console.log('beat2 has a x ' + content_beat2);
    } else {
      landing_beat2 = cast_int(content_beat2[0]) + swap_beat2;
    }
    console.log('b['+ String(swap_beat) + '] goes to..' + String(landing_beat));
    console.log('b['+ String(swap_beat2) + '] goes to..' + String(landing_beat2));
    // swap_beat1 new throw is?
    new_throw = landing_beat2 - swap_beat;
    var new_throw_string;
    if (new_throw % 2 != 0) {
      if (swap_beat % 2 != 0) {
        // hier korrigieren 2do 10 -> a usw.
        new_throw_string = cast_string(new_throw+1) + "x"
      } else {
        new_throw_string = cast_string(new_throw-1) + "x"
      }
    } else {
      new_throw_string = cast_string(new_throw);
    }
    // swap_beat2 new throw is?
    new_throw2 = landing_beat - swap_beat2;
    var new_throw_string2;
    if (new_throw2 % 2 != 0) {
      if (swap_beat2 % 2 != 0) {
        // hier korrigieren 2do 10 -> a usw.
        new_throw_string2 = cast_string(new_throw2+1) + "x"
      } else {
        new_throw_string2 = cast_string(new_throw2-1) + "x"
      }
    } else {
      new_throw_string2 = cast_string(new_throw2);
    }

    console.log('b[' + String(swap_beat) + "] shall become..." + String(new_throw));
    console.log('b[' + String(swap_beat2) + "] shall become..." + String(new_throw2));
    console.log('b[' + String(swap_beat) + "] is" + new_throw_string);
    console.log('b[' + String(swap_beat2) + "] is" + new_throw_string2);

  //  content_beat = new_throw_string;
  //  content_beat2 = new_throw_string2;
  if (Number(new_throw_string[0]) < 1 || Number(new_throw_string2[0]) < 1){
    console.log('bad choice');
    swap_beat = -1;
    return;
  }
    document.getElementById("b" + String(swap_beat)).innerHTML = new_throw_string;
    document.getElementById("b" + String(swap_beat2)).innerHTML = new_throw_string2;
    document.getElementById("b" + String(swap_beat2)).blur();
    swap_beat = -1;
  }
  //console.log('button: ' + n);
}


function cast_string(n){
  if (n < 10){
    return String(n);
  } else {
    return String.fromCharCode(n+87);
  }
}

function get_out_asyn(noo,a_ss){
  console.log('Doing async get_out');
  // I got a state [1,0,0,1,1,0,1]
  //console.log('get outs...');
  get_out = [];
  got_one = -1;
  var shift = 0;
  res_get_out = "";
//  console.log('starting with..');
//  console.log(a_ss);
  while (a_ss.length > noo){
    if (got_one == -1 && a_ss[0] == 0){
      get_out.push(0);
      a_ss.shift(); // erstes Element killen
      continue;
    } else if (a_ss[0] == 1 && got_one == -1) {
      got_one = 1;
      shift = 1;
      while (a_ss[shift] != 0) {
        shift++;
      //  console.log('doing:' + a_ss[0] );
      //  console.log('shift++');
      }
      // dann ist a_ss[shift] = 1
      get_out.push(shift);
      a_ss[shift] = 1;
      a_ss = a_ss.slice(shift-1,a_ss.length);
      // console.log('new sliced peace:');
      // console.log(a_ss);
      // console.log('get outs..');
      // console.log(get_out);
      got_one = -1;
    }

  }
  for (var i=0;i<get_out.length;i++){
    res_get_out += cast_string(get_out[i])
  }
  // going to use first throw for first gab. i
  console.log('final out:');
  console.log(res_get_out);
  return res_get_out;
}

function get_in_asyn(noo,a_ss){
  console.log('doing asyn get_in');
  console.log(a_ss);
  console.log(noo);
  var a_neutral = [];
  // case state is groundstate
  if (a_ss.length == 0){
    console.log('return');
    return "";
  }
  // creating groundstate throws
  for (var i=0;i<noo;i++){
    a_neutral.push(noo);
  }
  var pos = 0;
  // first throw shall meet first 1 in state, second throw shall meet second 1 in state ...
  for (var i=0;i<noo;i++){
    while (a_ss[i+pos] != 1){
      pos++;
    }
    a_neutral[i] += pos;
  }
  console.log(a_neutral);
  // get the neutral throws out of the get in
  while (a_neutral[0] == noo){
    // delete first element from array
    a_neutral.shift();
  }
  res_get_in = "";
  for (var i=0;i<a_neutral.length;i++){
    res_get_in += cast_string(a_neutral[i]);
  }
  // return array of ints better string with a8
  console.log('get in array');
  console.log(a_neutral);
  console.log(res_get_in);
  return res_get_in;
}
function get_out_sync(noo,num_state_li) {
  throw_li = [];
  while (num_state_li.length > noo){
    // first element
    item = num_state_li.shift();
    console.log('item:' + item);
    console.log('length' + num_state_li.length);
    console.log('state_li' + num_state_li);
  if (item == 0) {
    throw_li.push(0);
  } else {
    for (var i=0;i<num_state_li.length; i++){
      // +1
      if (num_state_li[i] == 0) {
        num_state_li[i] = 1;
        throw_li.push(i+1);
        break;
      }
    }
  }
  }
  a_throw_asyn = throw_li;
  get_out_throws = "";
  for (var i=0;i<a_throw_asyn.length;i=i+2){
    var str_throw1;
    var str_throw2;
    if (a_throw_asyn[i] % 2 == 1){
        // von links -1 und x
        str_throw1 = cast_string(a_throw_asyn[i] - 1) + 'x';
    } else {
      str_throw1 = cast_string(a_throw_asyn[i]);
    }
    if (a_throw_asyn[i+1] % 2 == 1){
        // von links -1 und x
        str_throw2 = cast_string(a_throw_asyn[i+1] + 1) + 'x';
    } else {
      str_throw2 = cast_string(a_throw_asyn[i+1]);
    }
    //
    get_out_throws = get_out_throws + '(' + str_throw1 + ',' + str_throw2 + ')';
  }
  console.log('Throw Li from get_out_sync:');
  console.log(throw_li);
  console.log('final!!!!');
  console.log(get_out_throws);
  return get_out_throws;
}

function create_state_sync(noo,num_li){
  // noo = number of objects
  // num_li is asyn converted int array (6x,4)(4,6x) -> [7,4,4,5]
  console.log('- Create_State_Sync');
  console.log('- num_li input:');
  console.log(num_li);
  // find max
  a_ss_int = num_li;
  var limit = num_li.length;
  var max = -1;
  // console.log('num_li ' + num_li);
  // console.log('max is ' + max);
  // console.log('noo is ' + noo);
  // limit falsch -1
  for (var i=0;i<limit;i++){
    if (a_ss_int[i] > max){
      max = a_ss_int[i];
    }
  }
  // add the element
  for (var i=0;i<noo-1;i++){
    for (var j=0;j<limit;j++){
      a_ss_int.push(a_ss_int[j]);
    }
  }
  //console.log(a_ss);
  //console.log(a_ss_int);
  //console.log('noo: ' + number_of_objects_sync(siteswap));
  //console.log('max: ' + max);
  var cut_pos = a_ss_int.length;
  for (var i=0;i<max;i++){
    a_ss_int.push(0);
  }
  // console.log(a_ss_int);
  for (var i=0;i<cut_pos;i++){
    if (a_ss_int[a_ss_int[i]+i] == 0){
      a_ss_int[a_ss_int[i]+i] = 1;
    }
  }
  state_to_big = a_ss_int.slice(cut_pos,a_ss_int.length); // [1,1,1,0,0]
  // bereinigung von nullen
  var delete_some = true;
  while (delete_some) {
    a = state_to_big[state_to_big.length - 1];
    if (a == 0){
      state_to_big.pop();
    } else {
      delete_some = false;
    }
  }
  // optisch ansprechender state [1,1,1] -> (1,1)(1,0)
  // mach die Laenge gerade !
  if (state_to_big.length % 2 == 1) {
    state_to_big.push(0);
  }
  var res_string = "";
  for (var i=0;i<state_to_big.length;i=i+2){
    res_string = res_string + '(' + state_to_big[i] + ',' + state_to_big[i+1] + ')';
  }
  //console.log(state_to_big);
  console.log(res_string);
  console.log('- Create_State_Sync - Finished');

  // get in erzeugung
  // fall gs is easy
  // state_to_big holds array with state [1,1,1,0,0,1]
  if (noo % 2 == 0) {
    a_throw_asyn = [];
    console.log('Unique gs found!');
    for (var i=0;i<state_to_big.length;i++){
      if (state_to_big[i] == 1){
        a_throw_asyn.push(i);
      }
    }
    for (var i=0;i<a_throw_asyn.length;i++){
      a_throw_asyn[i] = a_throw_asyn[i] - i + noo;
    }
    // anpassen der throwlist 4,4,4,5 -> (4,4)(4,6x)
    get_in_throws = "";
    console.log(a_throw_asyn);
    console.log('laenge:' + a_throw_asyn.length);
    for (var i=0;i<a_throw_asyn.length;i=i+2){
      var str_throw1;
      var str_throw2;
      if (a_throw_asyn[i] % 2 == 1){
          // von links -1 und x
          str_throw1 = cast_string(a_throw_asyn[i] - 1) + 'x';
      } else {
        str_throw1 = cast_string(a_throw_asyn[i]);
      }
      if (a_throw_asyn[i+1] % 2 == 1){
          // von links -1 und x
          str_throw2 = cast_string(a_throw_asyn[i+1] + 1) + 'x';
      } else {
        str_throw2 = cast_string(a_throw_asyn[i+1]);
      }

      console.log('called...');
      if (str_throw1 == String(noo) && str_throw2 == String(noo)){
        continue;
      } else {
      get_in_throws = get_in_throws + '(' + str_throw1 + ',' + str_throw2 + ')';
    } // end for
  } // end gs with even number of objects (unique groundstate)
    // (6,6)(6x,8)(8x,a) needs to be cleaned because (6,6) is regular throw with 6 objects
    // state_to_big = [1,0,1,1,1,0,0,1] holds state
    // idea use asyn version and convert after
    console.log('param for get_out_asyn');
    console.log(noo);
    console.log(state_to_big);
    var get_out_throws = get_out_sync(noo,state_to_big);
    // console.log(get_out_tmp);
  } else {
    // noo is odd
    // wenn es ein splitstate ist gib eine besondere ausgabe aus.
    console.log('got everything?');
    console.log(noo);
    console.log(res_string);
    console.log(state_to_big);
    if (state_to_big.length == noo + 1 && (state_to_big[state_to_big.length-1] == 0 || state_to_big[state_to_big.length-2] == 0)){
      // check if it is a splitstate
      if (state_to_big[state_to_big.length-1] == 0) {
        console.log('splitestate from left!');
        return 'splitestate left ' + res_string;
      } else if (state_to_big[state_to_big.length-2] == 0) {
        console.log('splitestate from right');
        return 'splitestate right ' + res_string;
      }
    } else {
      console.log('no splitestate!');
      get_in_throws_left = 'von links rein (excited)';
      get_out_throws_left = 'von links raus';
      get_in_throws_right = 'von rechts rein (excited)';
      get_out_throws_right = 'von rechts raus';
      get_in_throws_left = 'from left ';
      get_in_throws_right = 'from right ';
      var a_get_in_throws_left = [];
      landing_beats = [];
      for (var i=0;i<state_to_big.length;i++){
        if (state_to_big[i] == 1) {
          landing_beats.push(1+i+noo);
        }
      }
      console.log('we are going to!');
      console.log(landing_beats);
      for (var i = 0; i < landing_beats.length; i++) {
        landing_beats[i] -= i;
      }
      // from left!!!
      for (var i=0;i<landing_beats.length;i++){
        if (landing_beats[i] % 2 == 0){
          a_get_in_throws_left.push(cast_string(landing_beats[i]));
        } else if (i % 2 == 0) {
          // odd and from left
          a_get_in_throws_left.push(cast_string(landing_beats[i]-1)+'x');
        } else {
          a_get_in_throws_left.push(cast_string(landing_beats[i]+1)+'x');
        }
      }
      // build more visual pleasing throw list '6','6','6x','8','8x' comes to (6,6)(6x,8)(8x,0) or ... (0,8)
      for (var i=0;i<a_get_in_throws_left.length-1; i=i+2){
        // for 5 elements do only 2 cycles
        get_in_throws_left += '(' + a_get_in_throws_left[i] + ',' + a_get_in_throws_left[i+1] + ')';
        get_in_throws_right += '(' + a_get_in_throws_left[i] + ',' + a_get_in_throws_left[i+1] + ')';
      }
      // last pair from left
      get_in_throws_left +='(' + a_get_in_throws_left[a_get_in_throws_left.length-1] + ',' + '0' + ')';
      console.log('what?' + a_get_in_throws_left[a_get_in_throws_left.length-1]);
      console.log('what len?' + a_get_in_throws_left[a_get_in_throws_left.length-1].length);
      console.log('first?' + a_get_in_throws_left[a_get_in_throws_left.length-1][0]);
      if (a_get_in_throws_left[a_get_in_throws_left.length-1].length > 1){
        get_in_throws_right += '(' + '0' + ',' + a_get_in_throws_left[a_get_in_throws_left.length-1][0] + ')';
      } else {
        get_in_throws_right += '(' + '0' + ',' + a_get_in_throws_left[a_get_in_throws_left.length-1] + 'x' + ')';
      }
      console.log('RESULT LEFT');
      console.log(get_in_throws_left);
      console.log('RESULT RIGHT');
      console.log(get_in_throws_right);
      console.log('some');
      console.log('some');
      console.log('some');
      console.log('some');
      console.log(a_get_in_throws_left);
      // last throw from left (decision)
      console.log('corrected ones');
      console.log(landing_beats);
      // no splitstate

      // Get out throws
      a_get_out_throws = [];
      for (var i=0;i<state_to_big.length;i++){
        if (state_to_big[i] == 1){
          for (var j=i+1;j<state_to_big.length;j++){
            if (state_to_big[j] == 0){
              a_get_out_throws.push(j-i)
              console.log('from ' + i + ' to ' + j);
              state_to_big[j] = 1;
              break;
            }
          }
        } else {
          a_get_out_throws.push(0);
        }
      }
      // wenn ein Wurf fehlt .. (8x,2x)
      if (a_get_out_throws.length % 2 == 1){
        a_get_out_throws.push(noo);
      }
      a_get_out_throws_left = [];
      for (var i=0;i<a_get_out_throws.length;i++){
        if (a_get_out_throws[i] % 2 == 0){
          a_get_out_throws_left.push(cast_string(a_get_out_throws[i]));
        } else if (i % 2 == 0) {
          // odd and from left
          a_get_out_throws_left.push(cast_string(a_get_out_throws[i]-1)+'x');
        } else {
          a_get_out_throws_left.push(cast_string(a_get_out_throws[i]+1)+'x');
        }
      }
      // wenn zwei Wuerfe fehlen ? bsp
      a_get_out_throws_right = a_get_out_throws_left.slice(0);
      last_item = a_get_out_throws_right.pop();
      if (last_item.length < 2){
        a_get_out_throws_right.push(last_item + 'x');
      } else {
        a_get_out_throws_right.push(last_item[0]);
      }
      // make beautiful
      var get_out_throws_left = '';
      var get_out_throws_right = '';
      for (var i=0;i<a_get_out_throws_left.length; i=i+2){
        // for 5 elements do only 2 cycles
        get_out_throws_left += '(' + a_get_out_throws_left[i] + ',' + a_get_out_throws_left[i+1] + ')';
        get_out_throws_right += '(' + a_get_out_throws_right[i] + ',' + a_get_out_throws_right[i+1] + ')';
      }
      //
      // align splitstates under each other
      if (a_get_out_throws_left[a_get_out_throws_left.length-1].length > 1){
        get_out_throws_right += '\u00a0';
      } else {
        get_out_throws_left += '\u00a0';
      }
      console.log('GET OUTS!');
      console.log(a_get_out_throws);
      console.log(a_get_out_throws_left);
      console.log(a_get_out_throws_right);
      console.log(a_get_out_throws);
      console.log(a_get_out_throws);
    }
  } // end noo odd
    //console.log('get throw list for get in development');
    //console.log(a_throw_asyn);
    //console.log(get_in_throws);

    // case beginning 0
  // fall gs gibt es zweimal

  // get out erzeugung
  // fall gs is easy
  // fall gs gibt es zweimal
  if (noo % 2 == 0) {
    if (get_in_throws.length == 0){
      return 'groundstate';
    } else {
      return get_in_throws + ' | ' + res_string + ' | ' + get_out_throws;
    }
  } else {
    var splitstate_left = get_in_throws_left + ' | ' + res_string + ' | ' + get_out_throws_left;
    var splitstate_right = get_in_throws_right + ' | ' + res_string + ' | ' + get_out_throws_right;
    return splitstate_left + '<br/>' + splitstate_right + '<br/>';
  }
}


function create_state_asyn(siteswap){
  // bekommt string und muss ihn in array zerlegen
  console.log('creating state...');
  a_ss = siteswap.split("");
  a_ss_int = [];
  // creating a number array out of '441'
  for (var i=0;i<siteswap.length;i++){
    a_ss_int.push(cast_int(a_ss[i]));
  }
  // find max
  var limit = siteswap.length;
  var max = -1;
  for (var i=0;i<limit-1;i++){
    if (a_ss_int[i] > max){
      max = a_ss_int[i];
    }
  }

  var noo = number_of_objects_asyn(siteswap);
  for (var i=0;i<noo-1;i++){
    for (var j=0;j<limit;j++){
      a_ss_int.push(a_ss_int[j]);
    }
  }
  //console.log(a_ss);
  console.log(a_ss_int);
  console.log('noo: ' + number_of_objects_asyn(siteswap));
  console.log('max: ' + max);
  var cut_pos = a_ss_int.length;
  for (var i=0;i<max;i++){
    a_ss_int.push(0);
  }
  console.log(a_ss_int);
  for (var i=0;i<cut_pos;i++){
    if (a_ss_int[a_ss_int[i]+i] == 0){
      a_ss_int[a_ss_int[i]+i] = 1;
    }
  }
  state_to_big = a_ss_int.slice(cut_pos,a_ss_int.length); // [1,1,1,0,0]
  console.log('id355' + state_to_big);
  var delete_some = true;
  while (delete_some) {
    a = state_to_big[state_to_big.length - 1];
    if (a == 0){
      state_to_big.pop();
    } else {
      delete_some = false;
    }
  }
  real_state = state_to_big.join("");
  if (real_state.length < 1){
    state_to_big = [];
  }
  console.log('uebergabe an get_in' + noo + ' und ' + state_to_big);
  console.log(state_to_big);
  // gibt string zurueck

  get_in_throws = get_in_asyn(noo,state_to_big);
    console.log('get ins:');
    console.log(get_in_throws);
  get_out_throws = get_out_asyn(noo,state_to_big);
    console.log('get out:');
    console.log(get_out_throws);
  var res = "";
  if (get_in_throws == ""){
    res = "groundstate - "
  } else {
    res = "excited - " + get_in_throws + " | " + real_state + " | " + get_out_throws + " - ";
  }
  return res;
}

function callPage_asyn(siteswap){

  // clear old page and set styling
  var wrapper = document.getElementById("wrapper");
  // set content to nothing
  wrapper.innerHTML = "";
  // set styling for wrapper text-align = center;
  wrapper.style.textAlign = "center";
  //wrapper.style.backgroundColor = "#eee";
  //wrapper.style.height = "200px";
  // Create Back and COPY Button
  create_back_and_copy_button();
  // put buttons in the wrapper with id b0, b1,b2
  console.log('-- Asyn Swap Creator --');
  create_swap(siteswap);

  // set the number of number of objects
  var noo = number_of_objects_asyn(siteswap);
  var info = document.getElementById('info');
  // info.innerHTML = siteswap + "hellip;" + ' holds ' + number_of_objects_asyn(siteswap) + ' objects.';
  info.innerHTML = create_state_asyn(siteswap) + number_of_objects_asyn(siteswap) + ' objects';
}

function searchKeyPress(e)
  {
    // look for window.event in case event isn't passed in
    e = e || window.event;
    // 13 is ENTER
    if (e.keyCode == 13)
    {
        document.getElementById('myButton').click();
        return false;
    }
    return true;
  }

function check_ss(){
    var siteswap = document.getElementById('siteswap');
    ss = siteswap.value;

    // Valid-Test
    var s_len = ss.length;

    // case empty
    if (s_len == 0){
      return;
    }
    // 2do I could check if there are odd throws in the expression
    // async - regular expression ^[a-zA-Z0-9]*$
    // sync - regular expression ^[a-zA-Z0-9(),*]*$

    var isasyn = /^[a-zA-Z0-9]*$/.test(ss);
    var issyn = /^[a-zA-Z0-9(),]*$/.test(ss);
    var issyn_astrix = /^[a-zA-Z0-9(),*]*$/.test(ss);

    // case no siteswap at all
    if (isasyn == false && issyn == false && issyn_astrix == false ) {
      console.log("both false - get me out of here");
      return;
    }

    // case asyn
    if (isasyn == true) {
      // check validness
    var sol_li = [];
    for (var i=0; i < s_len; i++){
        num = (i + cast_int(ss[i])) % s_len;
        sol_li.push(num);
    }
    var i = 0;
    while (sol_li.includes(i)){
      i++;
    }
    if (i == s_len){
      callPage_asyn(ss);
      console.log(":: callPage_asyn with " + ss + " ended");
      //console.log(ss);
      //console.log(":: noObj " + number_of_objects_asyn(ss));
    } else {
      // alert("Hello\nthat's not good at all.");
      console.log(":: not valid, stoped by: " + i);
    }
    return;
    }

    if (issyn_astrix == true && issyn == false){
      // schreibe um und setze ss_neu auf ss und issyn auf true ! :)
      // drop the astrix, then reverse it
      ss = ss.slice(0,-1);
      var new_str = ss.split("").reverse();
      //console.log(new_str);
      var limit = new_str.length;
      for (var j=0;j<limit;j++){
        //console.log(j + ' ... ' + new_str[j]);
        if (new_str[j] == ')'){
          new_str[j] = '(';
          //console.log('pos:  ' + j + ' is now' + new_str[j]);
        } else if (new_str[j] == '(') {
          new_str[j] = ')'
          //console.log('pos: ' + j + 'is now' + new_str[j]);
        } else if (new_str[j] == 'x') { // && (new_str[j+1] != ')' || new_str[j+1] != ')')
          new_str[j] = new_str[j+1];
          new_str[j+1] = 'x';
          j++;
          //console.log('pos: ' + j + 'is now' + new_str[j]);
        }
      }
      // setze neuen Siteswap und uebergebe an issyn
      new_str = new_str.join("");
      ss = ss + new_str;
      console.log('siteswap: '+ ss );
      issyn = true;
    }

    // case sync
    // without astrix
    if (issyn == true) {
      // check validness
      console.log('Sync (without astrix) check ...');
      var char_li = [];
      var char_new;
      for(var i=0;i<ss.length;i++){
        char_new = ss[i];
        if (char_new == '(' || char_new == ')' || char_new == ','){
          //console.log('continue at ' + char_new);
          continue;
        }
        if(char_new == 'x' && i > 0){
          char_li[char_li.length-1] = char_li[char_li.length-1] + "x";
        } else {
          char_li.push(char_new);
        }
      }
      var num_li = [];
      for (var j=0;j<char_li.length;j++){
        //console.log('char_li' + '[' + j + '] ' + char_li[j]);
        var string_old = char_li[j]; // string
        var num_new; // number
        if (string_old.length > 1 && j % 2 == 0) {
          new_num = cast_int(string_old[0]) + 1;
        } else if (string_old.length > 1) {
          new_num = cast_int(string_old[0]) - 1;
        } else {
          new_num = cast_int(string_old[0]);
        }
        num_li.push(new_num);
        // console.log('num_li' + '[' + j + '] ' + num_li[j]);
      }
      // landing beats
      sol_li = [];
      for (var j=0;j<num_li.length;j++){
            var num = (j + num_li[j]) % num_li.length;
            sol_li.push(num);
        }
        var i = 0;
        while (sol_li.includes(i)){
          i++;
        }
        if (i == num_li.length){
          callPage_sync(ss,char_li,num_li);
          console.log(":: success with " + i);
          console.log(ss);
          //console.log(":: noObj " + number_of_objects_asyn(ss));
        } else {
          // alert("Hello\nthat's not good at all.");
          console.log(":: not valid, stoped by: " + i);
        }
      // build chunks (4x,2)(2,2x) into ['4x','2','2','2x']
      // build number
      return;
    }

    //console.log(":: " + ss + " regular fit asyn? " + isasyn);
    //console.log(":: " + ss + " regular fit syn? " + issyn);
  }

function createThrowAsyn(ss, num, throw_h){
    var myThrow = document.createElement("button");
    // setting attributes id b0, b1, b2, ... and text 8, 4, 4, ...
    //console.log('here?')
    myThrow.id = "b" + String(num);
    myThrow.innerHTML = throw_h;
    myThrow.onclick = function() {count_asyn(num)}; // "count(" + num + ")";
    // styling
    // calc = 100/(2*ss.length-1);
    // bis 5 Wuerfe
    if (ss.length <= 6){
      width = 5;
      height = "80px";
      fontSize = "3rem";
    } else if (ss.length <= 10 ){
      width = 4;
      height = "60px";
      fontSize = "2rem";
    } else {
      width = 100/(2*ss.length-1);
      width = width.toFixed(2);
      height = "50px"
      fontSize = "1rem";
    }

    //console.log("Settings for siteswap with len: " + ss.length)
    //console.log("width:", width)
    //console.log("height:", height)
    //console.log("font-size:", fontSize)

    myThrow.style.width = width + "%";
    myThrow.style.height = height;
    myThrow.style.fontSize = fontSize;

    return myThrow;

  }


  function createThrowSync(ss, num, throw_h) {
      var myThrow = document.createElement("button");
      // setting attributes id b0, b1, b2, ... and text 8, 4, 4, ...
      myThrow.id = "b" + String(num);
      myThrow.innerHTML = throw_h;
      myThrow.onclick = function() {count_sync(num)}; // "count(" + num + ")";

      // styling
      // calc = 100/(2*ss.length-1);
      // bis 5 Wuerfe
      if (ss.length <= 6){
        width = 5;
        space = 0;
        height = "80px";
        fontSize = "3rem";
      } else if (ss.length <= 10 ){
        width = 4;
        space = 0;
        height = "60px";
        fontSize = "2rem";
      } else {
        width = 100/(2*ss.length-1);
        width = width.toFixed(2);
        //space = width / 2;
        //space = space.toFixed(2);
        space = 0;
        height = "50px"
        fontSize = "1rem";
      }

      // console.log("Settings for siteswap with len: " + ss.length)
      // console.log("width:", width)
      // console.log("space:", space)
      // console.log("height:", height)
      // console.log("font-size:", fontSize)

      myThrow.style.width = width + "%";
      myThrow.style.height = height;
      myThrow.style.marginRight = space + "%";
      myThrow.style.fontSize = fontSize;

      //myThrow.style.backgroundColor = "green";
      if(num == ss.length-1) {
        myThrow.style.marginRight = "0%";
      }
      return myThrow;

    }

  function create_swap(ss) {
    //alert("Chris\nYou want to swap: " + ss)

    // lets create some Buttons
    var wrapper = document.getElementById("wrapper");
    var myThrows = [];
    var numOfThrows = ss.length;

    for (var i=0; i < numOfThrows; i += 1) {
        myThrows.push(createThrowAsyn(ss,i,ss[i]));
        wrapper.appendChild(myThrows[i]);
      }

    }
