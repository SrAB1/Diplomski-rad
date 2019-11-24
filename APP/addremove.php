<?php

include 'config.php';

$data = json_decode(file_get_contents("php://input"));

$request_type = $data->request_type;

// Daj sve rekorde
if($request_type == 1){
    $sel = mysqli_query($con,"select * from users");
    $data = array();

    while ($row = mysqli_fetch_array($sel)) {
        $data[] = array("id"=>$row['id'],"fname"=>$row['fname'],"lname"=>$row['lname'],"username"=>$row['username'],"kursevi"=>$row['kursevi'],"email"=>$row['email']);           
    }
    echo json_encode($data);
}

// Ubaci rekord
if($request_type == 2){
    $fname = $data->fname;
    $lname = $data->lname;
    $uname = $data->uname;
    $kursevi = $data->kursevi;
    $email = $data->email;


    

    mysqli_query($con,"insert into users(fname,lname,username,kursevi,email) values('".$fname."','".$lname."','".$uname."','".$kursevi."','".$email."')");
    $lastinsert_id = mysqli_insert_id($con);

    $return_arr[] = array("id"=>$lastinsert_id,"fname"=>$fname,"lname"=>$lname,"username"=>$uname,"kursevi"=>$kursevi,"email"=>$email);
    echo json_encode($return_arr);
}

// Obrisi rekord
if($request_type == 3){
    $userid = $data->userid;

    mysqli_query($con,"delete from users where id=".$userid);
    echo 1;
}

