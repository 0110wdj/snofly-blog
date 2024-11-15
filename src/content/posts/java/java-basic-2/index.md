---
title: Java学习笔记二（温故知新）
published: 2021-02-21
description: ""
image: ""
tags: ["Java"]
category: "Java 入门"
draft: false
---

# 说明

本文章记录的内容是零散的。
我看书时候，遇到觉得有意思的地方、值得记录一下的知识点、被我以前忽略的地方，就写下来。

# 第四章 面向对象 上

1、类中局部变量在**使用前**必须进行赋值初始化。

2、this 用于区分局部变量和域变量。

3、方法在调用时，系统会开辟一个栈空间，存放局部变量和形式参数。
执行时，访问复制到对象中的属性。
方法执行完毕后，栈空间被释放。

4、static 修饰的属性专属于类，不复制到对象中；static 方法
调用时，同样的开辟栈空间。
执行时，只能访问专属于类的 static 的属性。
执行后，栈空间释放。

5、ClassName cn = new ClassName();代码执行过程是，先产生对象，之后将对象赋予声明 fp。

6、内存空间分为堆和栈。
堆在应用程序生命周期内一直存在；
栈在方法调用完毕后被释放。
类和对象分配在堆当中；
方法执行时使用的局部变量和形式参数则放在栈空间中。

7、ClassName cn = new ClassName();语句在某个方法中执行时，声明 cn 存在于方法栈中，cn 相关的对象存在于堆中。方法栈空间释放后，cn 相关的对象仍会存在一段时间。

意义：本方法方法执行完毕后，产生的对象可能在其他地方仍然被使用。于是，可能有多个声明都和这个对象相关。如果每释放一个声明，就全部检索一遍是否仍有相关，这将是非常浪费资源的行为。当然，无用的对象在堆中也会消耗空间资源。没有十全十美。

8、数组名.length 中分 length 是属性，不是方法。

9、void 返回与 没有返回的区别。void 只是用于标记该方法没有返回，与有返回的方法作区分。而构造方法与析构方法本身有隐含的返回值，该值由系统内部使用，所以就不写 void 标记，当然其他标记也不可以。

10、构造方法被系统自动调用，不能通过对象引用来调用。

11、System.gc() 方法提醒系统进行一次垃圾释放，但不一定释放，因为垃圾回收的系统线程级别很低。

根据 Java 文档，finalize() 是一个用于释放非 Java 资源的方法。例如本地方法——在 java 中调用的非 java 代码。

不重写 finalize 方法：
使用 try...finally...代码块，将要执行的后续操作放入到 finally 块中。

12、static 方法只能访问到 static 属性或方法，非 static 方法可以访问全部。

13、如果 main 方法中缺少 static ，虽然编译能够通过，但它不能作为程序的入口。
原理一：当类被装载时，静态代码块被执行，且只被执行一次。

14、final 修饰的类属性，相对于常量的值，有助记符。

15、包的特殊存在形式——默认包

16、package 是 Java 产生包路径的关键字，且应放在程序的第一句。

# 第五章 面向对象 中

1、面向对象的基本特征**主要**有封装、继承和多态。

2、封装内部的 set 方法可以加上数据合法性检测。例如，String.trim() 方法用于删除字符串的头尾空白符。

3、访问控制权限有四种，第四种是“默认”（无任何修饰符）。修饰类的有两种：public 和默认。修饰类属性成员和方法的有四种。

4、类的构造方法的修饰符为 private 时，外部无法直接产生其对象。

5、public 类的 protected 属性和方法并不安全，因为可以通过子类对象直接访问其属性和方法。但是又可以加强子类的安全性，从而都变得安全。

6、程序=数据结构+算法；程序=对象+消息

7、生产子类对象时，只将父类和子类的非静态属性复制到子类对象中。

8、父类中存在 private 属性时，子类对象是否复制 private 属性，区分点在于，父类中是否存在可被继承的可以访问 private 属性的方法。分两种情况：其一，不存在，不复制，不能访问；其二，存在，复制，但是子类内部甚至都不能直接访问。

9、jdk11 中，Object.finalize() 被弃用，理由是 The finalization mechanism is inherently problematic.

10、java 中，同名同参数不同返回值类型的方法，不是重载，也不是子类中的覆盖。编译不能通过。

11、子类方法覆盖父类方法时，子类的访问修饰符权限应等于或大于父类的。（public 最大）

12、静态和非静态方法不能互相覆盖。

13、抽象类中如果存在抽象方法，则具体子类必须对抽象方法进行覆盖。

# 第六章 面向对象 下

1、注意 this 指代当前对象这种用法。

2、构造方法可以通过 this 调用重载的其他构造方法。注意，这个调用语句放在第一个可执行语句位置。

3、注意语句执行顺序：
System.ooutprintln("a + b + c =" + p1.add());
p1.add()完全执行完之后，才会打印前面的字符串"a+b+c="。

4、子类的构造方法必定调用父类的构造方法。至少会隐含调用 super() 。所以要注意：当父类只含有有参数的构造方法，子类自动调用时，可能出错。

5、思考：因为 super 的存在，那么子类在一定程度上，是可以控制父类属性的变化的。

6、构造方法中的代码要在显示初始化后执行。

7、抽象类的子类如果仍是抽象类，则不能定义和父类同名的抽象方法。

8、Java 中的借口有两种含义：
其一，可以被引用调用的方法；
其二，专有概念——interface 。

9、接口中的数据成员全部是 static final ，无论是否有修饰；
接口中的成员方法全部是抽象方法，无论是否有修饰；
接口没有构造方法，也并不能有自己的实例对象。

10、接口的作用：使功能的实现和使用以弱耦合的方式连接起来。

11、如果实现某接口的类不是抽象类，那么必须实现
接口中的全部抽象方法；这里的实现，可以来自是实现类本身；也可以来自他的抽象父类中实现了一部分的方法。

12、如果接口的抽象方法的访问控制符是默认或 public，那么实现时必须显示地使用 public 修饰符。

13、面向抽象类和接口编程，这是各种设计模式的核心思想之一。

14、JDK1.1 之后，Java 事件实现机制，从层次模型改为委托模型，即监听者模式。

15、注意，Java 事件处理机制。一般有两种方式，但是都是相同的：
1）事物委托型（监听者模式）
2）观察者模式
原理想通的。

16、灵活应用构造方法 ，来实现两个对象之间的互相链接。这是实现监听或观察的基本步骤。

17、当接口需要增加新功能方法时，完全可以通过接口的继承，将变化体现在子接口中，从而保证父接口的稳定。

18、父类申明看似比子类申明要更宽泛，因为父类声明所引用的子类对象在赋值给子类申明时，需要显示转换。这类似于，double 赋值给 float 时，要显示转换，防止溢出；反之，隐式转换。

在理解父类申明的使用时，不难发现，他不能调用子类新创的属性和方法，实际作用范围是小于子类申明的。

19、语句 a instanceof A 有三种结果：
a 是 A 或其子类的实例，true；
a 是 A 父类的实例，false；
若无关系，编译不能通过。

20、上述 19 条中，a instanceof A 中的子类，可以是指多代之后的子类，子、孙、玄孙，也都是 true。

21、数据成员隐藏，父类声明引用子类对象，这时，父类引用访问的对象属性默认是父类的那个被隐藏的数据。而方法覆盖时，父类引用访问的对象方法，是子类的那个方法。（Java 方法没有隐藏的概念。）

22、内部类存在于两个位置：
1）外部类域——可以被全部 6 种修饰符修饰。
2）方法内部——不能被任何修饰符修饰。

23、static 内部类不能再使用外部类的非 static 属性和方法。这符合之前对 static 的理解。

24、注意匿名内部类的多种情形和写法。

25、匿名内部类继承了只含有有参构造方法的父类时，需要在创建时的括号类带上相应的参数。当然，这样只是统一了形式，其内部仍没有构造方法。

26、Object 中的 getClass() 获得 Class 对象。主要作用是获得一些周边信息。

# 第七章 异常

1、稍稍注意异常 Exception 和错误 Error 的区分。
JDK 中关于 Error 的描述：
An Error is a subclass of Throwable that indicates serious problems that a reasonable application should not try to catch. Most such errors are abnormal conditions.

举例：运行算式时除 0，是异常，IO 找不到文件，是异常；
Java 虚拟机损坏或耗尽了继续运行所需的资源，是错误。

2、**虚拟机系统**产生异常对象。

3、异常隐式抛出的前提条件是，异常类型为 RuntimeException 或其子类。

4、语句 void functionName() throws IOException; 含义：
此处的异常不由本方法处理，而是由调用本方法的地方处理。

5、子类覆盖父类的方法时，异常类应该一致或为其异常子类。

6、try 后的 catch 语句可能有多个，因为 try 中的异常可能抛出多个。这类似于 switch case 语句的作用，因此，catch 中异常类的排序一般是按照 F 从子类到父类顺序。

7、Finally 语句块一旦选中，必定执行。例如：rty{return;}finally{System.out.println("字符串");}仍会打印字符串。

8、异常嵌套似乎一直存在，比如第一个 try catch 和 虚拟机之间就存在嵌套。

9、应用逻辑中的异常，不一定等于语言语法上的异常。于是，自定义异常，用来控制流程的跳转，就很有帮助了。

# 第八章 Java 常用类库与工具

1、稍稍注意顶层类和顶层包的概念。
这里也解释了为什么文件同名类总是 pubic 开头。

2、java.lang 包中的类无须 import 。

3、注意理解集合类、反射包类。水很深啊。

4、String 定义时，编译器会优化代码（编译器的优化都是可以通过参数控制开关是），导致 String str1 = "s"; String str2 = "s" ; 中，str1 和 str2 指向同一个对象，而不会产生新的对象。

5、字符串方法使用时，本身不能为 null。即使调用的是增加后缀的方法。

6、返回新字符串的方法，不能改变原来的字符串。例如
b = b.newString();
c = b.newString();
上述中，b 不改变，但是 c 会改变。

7、String 与 StringBuffer 的相互转化：
StringBuffer sb = new StringBuffer(new String());
String s = new String(new StringBuffer());// 或者使用 toString()方法。

意义：String 转化为 StringBuffer 便于字符串的处理，同时不会增加过多的 String 对象。

8、System 类不能被实例化。它的类成员方法都是静态的。（估计设计出来就是避免 Java 虚拟机和外部操作系统直接相关的。）

9、每一个 Java 应用程序只允许有一个 Runtime 类实例。（它涉及到关键的控制点，进程）

# 第九章 线程

1、线程本身的数据通常来自两个地方：
1）微处理器的寄存器；
2）程序运行时的堆栈。

2、Java 的产生线程的方法：
1）继承 Thread 类，并覆盖其 run 方法；
2）实现 Runnable 接口，并并将实现类对象传参到 Thread 类的构造方法。

3、Runnable 接口只有唯一的抽象方法 run();
上述两种方法原理是相通的，都是手动覆盖或者实现 run()方法，再由 Thread 的 start() 方法启动线程。

```java
// Thread 中的部分代码
private Runnable target;
public void run() {
        if (target != null) {
            target.run();
        }
    }
// ------------------------
public synchronized void start() {
        /**
         * This method is not invoked for the main method thread or "system"
         * group threads created/set up by the VM. Any new functionality added
         * to this method in the future may have to also be added to the VM.
         *
         * A zero status value corresponds to state "NEW".
         */
        if (threadStatus != 0)
            throw new IllegalThreadStateException();

        /* Notify the group that this thread is about to be started
         * so that it can be added to the group's list of threads
         * and the group's unstarted count can be decremented. */
        group.add(this);

        boolean started = false;
        try {
            start0();
            started = true;
        } finally {
            try {
                if (!started) {
                    group.threadStartFailed(this);
                }
            } catch (Throwable ignore) {
                /* do nothing. If start0 threw a Throwable then
                  it will be passed up the call stack */
            }
        }
    }

private native void start0();

```

start() 的 JDK11 描述：
Causes this thread to begin execution;
the Java Virtual Machine calls the run method of this thread.

4、两种方法的比较：
1）由于 Java 单继承的特性，所以通过继承覆盖 run() 的方式会有不小的局限性；
2）通过接口实现的方式，多线程可共享实现类对象的资源。

（其中第二条存疑，保留，暂时不做解释）

解释共享：
观察语句
RunnableImplement m = new RunnableImplement(参数);
Thread thread1 = new Thread(m);
Thread thread1 = new Thread(m);
这里都是传递的 m 到 Thread 构造方法，那么之后这两个线程自然都是围绕着 m 在运行，也就是访问的对象是同一个，同时控制对象内部的数据成员变化。

对比继承覆盖的方式，观察语句：
Thread a = new MyThread();
a.start();
这里如果出现多次声明创建 MyThread 对象，这些对象之间毫无交叉，彼此独立。

5、注意 volatile 关键字的作用：
让 JVM 总是从主存中读取数据，**一定程度上**防止共享的数据不一致。

6、一个具有生命的线程总是在五个态之一：
创建、可运行（就绪）、运行中、阻塞、死亡。

这里的“具有生命”和生物上的理解有些不同，包括了创建和死亡状态。

7、Java 中，如果一个程序只有后台线程，那么这个程序就会立即结束。

（前台线程和后台线程的区分与联系）

1）后台线程不会阻止进程的终止。属于某个进程的所有前台线程都终止后，该进程就会被终止。所有剩余的后台线程都会停止且不会完成。
2）可以在任何时候将前台线程修改为后台线程，方式是设置 Thread.IsBackground 属性。
3）不管是前台线程还是后台线程，如果线程内出现了异常，都会导致进程的终止。
4）托管线程池中的线程都是后台线程，使用 new Thread 方式创建的线程默认都是前台线程。

用法：
一般前台线程用于需要长时间等待的任务，比如监听客户端的请求；
后台线程一般用于处理时间较短的任务，比如处理客户端发过来的请求信息。

8、阻塞状态的线程，仍可能继续占用同就绪状态一样的资源。

9、yield() 暂停线程时，系统是选择其他同优先级线程执行，最后再选用自己。
这种设置，可以用来作为一种信息处理的手段。

10、Thread a; a.join(参数); 暂停的是这句话所在的线程（即当前线程），直到 a 线程执行完毕（或者一段时间，取决于参数）。

11、高优先级线程执行时，采用独占的方式调度。

12、多线程中程序执行顺序是多变的。

13、synchronized 工作原理、用法、区别。
（之后补充）

基本解释：
Java 语言为了解决并发编程中存在的原子性、可见性和有序性问题，提供了一系列和并发处理相关的关键字，比如 synchronized、volatile、final、concurren 包等。

用法：
主要有两种用法，分别是同步方法和同步代码块。也就是说，synchronized 既可以修饰方法也可以修饰代码块。

原理：
对于同步方法，JVM 采用 ACC_SYNCHRONIZED 标记符来实现同步。
对于同步代码块。JVM 采用 monitorenter、monitorexit 两个指令来实现同步。

无论是 ACC_SYNCHRONIZED 还是 monitorenter、monitorexit 都是基于 Monitor 实现的，在 Java 虚拟机(HotSpot)中，Monitor 是基于 C++实现的，由 ObjectMonitor 实现。

ObjectMonitor 类中提供了几个方法，如 enter、exit、wait、notify、notifyAll 等。

（大坑！目前填不上了。）

[参考文章](https://www.hollischuang.com/archives/2637)

14、Java 死锁相关。
Java 不能发现和避免死锁问题，这需要靠程序员自己注意......
（之后补充）

死锁是这样一种情形：多个线程同时被阻塞，它们中的一个或者全部都在等待某个资源被释放。由于线程被无限期地阻塞，因此程序不可能正常终止。

java 死锁产生的四个必要条件：

1、互斥使用，即当资源被一个线程使用(占有)时，别的线程不能使用
2、不可抢占，资源请求者不能强制从资源占有者手中夺取资源，资源只能由资源占有者主动释放。
3、请求和保持，即当资源请求者在请求其他的资源的同时保持对原有资源的占有。
4、循环等待，即存在一个等待队列：P1 占有 P2 的资源，P2 占有 P3 的资源，P3 占有 P1 的资源。这样就形成了一个等待环路。
当上述四个条件都成立的时候，便形成死锁。当然，死锁的情况下如果打破上述任何一个条件，便可让死锁消失。

15、wait 暂停当前线程，并释放该对象监视权；
（注意区分）sleep 暂停当前线程，但是不释放该对象监视权。

16、notify() 释放该对象监视权，并唤醒队列中和它拥有同类型对象监视器标签的等待线程。

17、线程同步通信由三方面配合实现：
1）方法前的 synchronized
2）方法中的 wait 和 notify
3）一个布尔型的变量指示器

18、notifyAll() 和 notify 理解。
（之后补充）

notify() 方法随机唤醒对象的等待池中的一个线程，进入锁池；notifyAll() 唤醒对象的等待池中的所有线程，进入锁池。

等待池：假设一个线程 A 调用了某个对象的 wait()方法，线程 A 就会释放该对象的锁后，进入到了该对象的等待池，等待池中的线程不会去竞争该对象的锁。

锁池：只有获取了对象的锁，线程才能执行对象的 synchronized 代码，对象的锁每次只有一个线程可以获得，其他线程只能在锁池中等待

# 第十章 集合类

1、集合类和集合接口类似与对象数组，但是其中的元素类型可以不一致。这好像 C 语言中的联合体。（具体区别需要另外去查资料，这里只是方便理解。）

2、对集合类对象中的对象元素进行遍历常用 Iterator 迭代器接口，而枚举接口 Enumeration 仅限于特定类，如 Vector、Hashtable 等。

3、for 循环的增强写法竟然有规定的读法：
写作：for (MyObject m: c) {}
读作：for each MyObject in c.

（有点 Python 的味道了）

4、注意五个类的关系：
子接口 ListIterator 继承了接口 Iterator；
子接口 List 和子接口 Set 继承了接口 Collection；
Collection 中可以调用方法产生 Iterator 对象引用；
List 中有额外的方法来生产 ListIterator。

5、ListIterator 可以说是 Iterator 的功能拓展，具有更多更强大的功能；但是相应的，他的使用范围被局限在 List 接口这一个地方。（这应当是列表和集合的不同特性决定的。）

6、基本数据类型的包装类都默认实现了 Collection 。

7、造型和泛型：
造型：在取出对象时进行类型转化，不匹配时抛出异常；
泛型：在定义时就加入类型标志，编译时自动检测类型匹配；

泛型在 JDK1.5 之后被引入，替代造型的使用。

8、Bitset 类是二进制类构成的集合，其中的元素都是 flalse 或 true 。于是，可以虚拟一个电脑了。

9、如果考虑类的性能问题，就一定要设置好集合对象的初始大小。（注意，它们自动增加容量的时候，是当前容量使用到一定程度——载入因子——的时候）

10、HashMap 对象遍历顺序与加入对象元素的顺序并不一致。而 TreeMap 的映像以关键字的字母顺序存储，单这却造成了额外的开销。

这两个配合使用，能够有效的坚固兼顾性能和排序需求。

# 第十一章 Applet 程序

虽然 Applet 不用了，但是学习一点基本概念也可以了解设计思想，触类旁通。

1、Applet 生命周期的四个状态：
初始态、运行态、停止态、消亡态。

2、状态转化涉及的四个方法：
init()、start()、stop()、destroy()

# 第十二章 AWT 图形界面

这一章也是简单了解基本概念即可。

1、容器（Container）继承自 Component ，所以其本身也是组件。但是他的主要功能是容纳其他组件和容器。

2、面板类（Panel ）是 Container 的子类，他实例化后必须装入到 Window 对象中。

3、Frame 对象创建后，如果要其可视，则必须调用 setVisible() 方法。

4、Frame 对象产生时，创建了一个前台线程——AWT 线程。

5、FileDialog 用于对文件读取和存储时指定路径和文件名。

6、组件是 Java 用户图形界面的基本单元。组件不能独立显示，必须放到特定的容器中。

7、组件文本框 Textfield 单行的文本输入框。

8、组件文本域 FileArea 是一个多行文本框。

9、单选按钮必须属于一个条目组，一个条目组中的按钮具有互斥关系。

10、列表与下拉列表的区别：
列表条目的数量超过列表显示的行数时会自送出现滚动条；
列表既可以多选也可以单选。

11、组件在容器中的位置可采用两种方式确定：
1）使用容器坐标系确定；
2）使用容器布局管理器确定。

容器默认采用的是布局管理器来进行组件布局。
如果要使用 1），则需要执行 setLayout(null) 语句。

12、布局管理器的类型主要有 5 种：

1）FlowLayout
Panel、Applet 容器的默认布局管理器；
布局规律：上下左右。

2）BorderLayout （Border 边境）
Window、Frame、Dialog 的默认布局管理器；
布局规律：把容器分为东西南北中 5 各区域。

3）GridLayout （Grid 网格）
布局规律：使容器中的各个组件呈网格状布局，平均占据容器的空间。

4）CardLayout
布局规律：把容器分为多层，每层显示空间占据整个容器大小，每层只放置一个组件。

5）GridBagLayout
布局规律：具有极强的灵活性。（自定义）
每个组件都有一个 GridBagConstraints 对象来给出他的大小和希望摆放的位置。

13、Java 程序运行时，用户在界面上进行的操作会被**系统捕捉**，然后产生相应的事件对象 event 交由事件程序处理。

14、Java 事件处理模型有两种：
1）JDK1.0 的层次事件模型
当事件产生时，它先被送往产生该事件的组件 (component), 如事件在这里未被处理，它就会被自动送往该组件的 Container, 如 Container 也未对事件进行处理，则还会递交给该 Container 的上一层 Container（如有的话）。

2）JDK1.1 以后的委托事件模型
当事件产生时，该事件被送到产生该事件的组件去处理，而要能够处理这个事件，该组件必须登记(register)有与该事件有关的一个或多个被称为 listeners 的类，这些类包含了相应的方法能接受事件并对事件进行处理。在这种模式中，事件的产生者和事件的处理者分离开来了，它们可以是不同的对象。事件的处理者，即那些 listeners，是一些实施了 Listener 接口的类。当事件传到登记的 listener 时，该 listener 中必须有相应的方法来接受这种类型的事件并对它进行处理。

14、AWT 监听接口的四种实现方式：
1）在实现者之中给出接口的每个方法实现；
2）采用接口形式产生匿名对象给出实现；
3）采用事件适配器方式；
4）采用适配器形式产生匿名对象给出实现；

15、可利用事件对象提供的方法得到事件源对象信息：
new ActionEvent().getSource() 返回事件源对象的引用。

16、书中原话：（当然 Swing 也凉凉了）
虽然 AWt 在 Java 界面设计中的地位被 Swing 逐渐取代，但**作为 Swing 理解和应用的基础**，AWT 仍然很**重要**。

# 第十三章 Swing 图形用户界面

1、AWT 的组件都有 peer 组件，peer 与特定操作系统相关的内容；Swing 的大部分组件都有由纯 Java 实现的委托组件 ComponentUI 。

2、Swing 采用 MVC 设计模式。
Model，View，Controller。

3、大多数 AWT 组件名称前面加上“J”就是 Swing 中对应的组件。

4、Swing 的容器**大致**分为三类：
顶层容器、中间容器、特殊容器。

5、编写 Swing 程序的步骤：
引入 Swing 包；
选择外观和感觉；
设置顶层容器；
设置 Swing 组件；
进行实践处理。

# 第十四章 I/O 输入/输出

1、流的分类：

1）流动方向
输入流、输出流

2）读取类型
字节流：InputStream 和 OutputStream 派生的一系列类
字符流：Reader 和 Writer 派生出的一系列类

3）发生的源头
节点流：直接操作目标设备的流
过滤流：程序可以通过过滤流去操作节点流

2、Java 标准输入/输出流
标准输入：对象是键盘，Java 对应的类是 System.in 。
标准输出：对象是屏幕，Java 对应的类是 System.out 。
标准错误输出：对象也是屏幕，Java 对应的类是 System.err 。

3、输入输出流调用 close 的作用是释放占用的系统资源，不仅仅是释放一个文件引用。

4、常用字符流：
1）文件流 FileInputStream、FileOutputStream
2）字节数组流 ByteArrayInputStream、ByteArrayOutputStream
3）管道流 PipedInputStream、PipedOutputStream
4）对象流 ObjectInputStream、ObjectOutputStream
5）过滤流 FilterInputStream、FilterOutputStream
6）缓冲流 BufferedInputStream、BufferedOutputStream
7）数据流 DataInputStream、DataOutputStream
8）打印流 PrintStream

5、字符流和字节流的相互转化的过程叫做流的**装配过程**。

6、File 类不仅指系统中的文件，也指目录。因为目录也是特殊的文件。

7、File 的含义和提供的方法使其很容易应用于递归之中。

8、写入文件时，有覆盖和追加两种方式，在 FileOutputStream 的构造方法中指出。

9、调用 flush 方法一次性将缓冲区的数据写入到 FileOutputStream 中。如果用 PrintStream，则调用 println 方法或者自动检测换行符，都会自动调用 flush 方法。

10、流装配套路固定，但是可以灵活使用。

11、对象串行化的目的是，便于网络传输和介质传输。

12、对象持久化：内存中的对象保存在硬盘介质上。

13、编列（Marshaling）就是将参数（不同机器之间调用方法时的参数传输比本地要复杂一点）转化为可以传输的形式。串行化之后编列。

14、Interface Serializable 中没有任何方法。他是对象串行化的一个标志，表明一个实现类加入对象串行化协议。

# 第十五章 Java 网络通信

1、Java 网络编程从传输层开始，并分为高层次网络编程（基于应用层）和低层次网络编程（基于传输层）。

数据链路层的编程和通信与设备紧密相关；网络层编程和操作系统紧密相关。这都不适合具有平台移植性的 Java 。

2、URL 最后可精确到一个文件名，或者文件内部的一个锚点。

加上锚点可以指定到页面上的某个元素，例如网站登录之后，回到登录前点选中的某个标签上，可以使用锚点来跳转回来。

3、一个 URL 对象生成之后，其属性不能改变，只能访问（通过其提供的方法）。

4、Java 下 Socket 编程主要指基于 TCP/IP 协议的网络编程。
注意：Socket 支持的协议种类不止 TCP/IP 协议一种，而可以操作 TCP/IP 协议的接口不止 Socket 一个。两者没有必然联系。

5、Socket 和 URL 应用场景不同。
Socket 面向内部网络通信；
URL 适用于面向 Internet 通信。

6、在关闭 Socket 之前，还应该关闭与 Socket 相关的所有输入/输出流。

7、bind() 方法没有调用时，系统会自动绑定本地地址和一个可用的端口。

8、DatagramSocket 用于在程序之间建立传送数据报的通信连接，DataGramPacket 则用来表示一个数据报。

9、Socket 中的地址和端口号是目的机器的地址和端口号，而 DatagramSocket 中的则是本机的。

# 第十六章 JDBC

1、JDBC 全称为：Java DataBase Connectivity
他是一种规范，统一 Java 应用程序对**关系数据库**的访问。

2、数据库的种类：（6 种）

层次数据库（Hierarchical Database，HDB）

关系型数据库（Relational Database，RDB）

面向文档（Document-Oriented）数据库

列存储（Column-oriented）数据库

XML 数据库（XML Database，XMLDB）

键值存储数据库（Key-Value Store，KVS）

3、数据库的作用是存储数据，同一个应用程序对存储到数据库中的数据使用逻辑往往都是一样的。

4、先有 Java.sql 中的各种接口的定义，再由数据库厂商按照接口定义来做它们的驱动程序。

~~（好家伙！一次工作转嫁，一辈子编程吃香。）~~

5、JDBC 驱动类型有三类：
1）纯 Java 驱动
2）JDBC 调用客户端
3）JDBC/ODBC 桥

6、使用 JDBC 操作数据库的步骤：（五个步骤）

1）载入 JDBC driver
// 类型不同，会有不同的载入操作。

2）得到数据库的 Connection 对象
// 注意，Connection、Statement、ResultSet 都是接口，要用特定的方式产生对象。

3）根据连接对象得到 Statement 进行查询或更新数据。

4）如果执行查询，则对记录集 ResultSet 进行遍历操；如果执行更新，则根据成功与否的返回结果进行数据库事务操作。
// 这里有很多细节操作值得注意，能够让运用更加灵活。

5）操作结束后，**依次**对 ResultSet、Statement、Connection 执行关闭操作。
// 注意，依次关闭，且由于容易发生异常，应该放在 finally 中执行。

7、在 finally 当中对接口引用对象关闭时，其接口声明应该在 try-catch-finally 之外。并且，finally 中也应该要进行异常捕获。

8、虽然 JDBC 面对不同数据库的代码不完全相同，但是已经做到了核心功能代码部分能够重用了。

# 第十七章 UML 简介

粗略的看了看，没什么记录。

# 第十八章 设计模式

1、GoF 模式
Gang of Four 四人组
系统的整理和描述了 23 种个精选的设计模式。

2、面向对象语言学习是一种规则学习，而设计模式学习则是进行面向对象设计思想的学习。

3、每个 GoF 模式都有四个要素：
模式名称、问题、解决方案、效果。

4、GoF 模式根据范围可分为类模式和对象模式两种，根据目的可分为创建型、结构型、行为型三种。

5、模式原则：

1）开闭原则
开闭原则是指软件系统对拓展开放，对修改关闭。
开闭原则的具体实现方法是，依赖接口编程而不是依赖实现编程。

2）组合 /聚合复用原则
继承是白箱复用，而组合聚合则是黑箱复用。
在复用选择时应该优先选择黑箱复用，有四个优点。

3）高内聚松耦合原则
耦合是指两个对象相互依赖对方的程度，内聚是指一个对象内部功能相联的程度。
（注意两点：类的单一职责，以及接口隔离）

# 第十九章 软件框架

1、软件框架（Software Framework）是对通用功能操作进行抽象的软件。

2、软件框架的四个特点：
1）基于框架的应用程序的流程控制在框架内部；
2）框架针对通用功能给出了默认实现；
3）框架内部代码不可被用户修改；
4）框架可以被应用程序有选择的覆盖和细化来实现功能。

3、框架是软件，设计模式是软件的知识。

4、常见的框架技术路线主要有两类：
1）微软的 .NET Framework；
2）基于 J2EE 的 Java 应用框架。

5、Srtuts 是实现 MVC （Model-View-Controller）架构的框架，分为 Struts1 和 Struts2。

6、Spring 是全方位的应用程序框架，功能强大。

7、AOP （Aspect-Oriented Programming） 是相对于面向过程、面向对象编程而言一种新的编程思想。Spring 提供面向对象编程的 AOP 子框架。

8、应用过于依赖框架不是件好事。如果能做到应用不依赖于框架，控制关系就会反向（IoC，Inversion of Control）。

9、Struts1 框架负责为 Model、View、Controller 三者之间的关系调用提供一个基本的环境。

10、Struts1 有四个不足之处：
1）框架同应用是正向控制关系，即应用依赖于框架；
2）易产生线程安全问题；
3）ActionForm 的冗余问题；
4）表现层单一：只支持 JSP。

11、Struts2 源于 WebWork，可以看做是 WebWork 的升级版，而不是 Struts1 的升级版。

12、Struts1 和 Struts2 的编程思维截然不同。

13、模板技术是指将视图显示和业务规则代码分离的一种技术。

14、Struts2 的 Controller 室友核心控制器 FilterDispatcher 和 Action 组成的。

15、一个 Action 的拦截器数量无要求。

16、Struts2 核心功能放在拦截器（Interceptor）上。

17、Struts2 与 Struts1 的对比：
1）Struts2 是个 IoC 反向控制容器，大大降低两类框架和应用的耦合；
2）Struts2 为每一个请求单独建立一个 Action 对象，从而不会产生线程安全问题；
3）Struts2 视图通过支持模板技术拓展了表现类型；
等等...

# 第二十章 软件体系结构与分布式对象技术

1、软件体系结构：
两种成分的集合：其一，具有一定形式的软件结构化元素；其二，他们之间的关系。

2、软件系统的分类：
1）从构成角度划分
构件、他们之间的调用关系
2）从开发过程角度划分
概念结构、物理结构
3）从运行角度划分
静态结构、动态结构
4）从部署的角度
集中式结构、**分布式结构**

3、常见的分布式系统结构：
C/S 以及 B/S

4、C/S 的特点是必须在客户端安装数据库客户端。

5、客户端三种类型：
胖客户端：C/S 结构中的客户端；
瘦客户端：B/S 结构中的浏览器端；
富客户端：介于二者之间。

6、富客户端又称富互联网应用程序（Rich Internet Application，RIA），其主要解决**通信**和**界面表示**两个问题。

7、RIA 技术主要有两类：其一是内嵌于浏览器中的 Ajax；其二是在浏览器中安装插件。

8、Ajax（Asynchronous JavaScript And XML，动态 JavaScript 和 XML）不是新的编程语言，而是一种使用现有标准的新方法。
Ajax 最大的优点是在不重新加载整个页面的情况下，可以与服务器交换数据并更新部分网页内容。

9、分布式软件系统就是将**物理上分散**的独立构件或系统，在**使用逻辑上**统一起来，相互合作来共同完成任务。

10、分布式软件系统需要解决的问题：
1）网络通信协议和通信方式的选择；
2）提供远程过程调用（Remote Procedure Call，RPC）接口；
3）名称查找，快速在网络上找到需要调用服务的计算机名称、地址、端口等；
4）安全机制，分布式软件系统彼此进行通信时需要确保数据传输和身份认证的安全性；
5）事务管理。

11、中间件是将不同软件构件或者操作者与多种应用程序连接起来的软件。

12、中间件的技术等级处于操作系统和应用程序“中间”。同框架相比，中间件是可以独立运行的成品软件。同操作系统相比，中间件只解决分布式软件系统某一类共性问题。

13、中间件的划分多种多样。

从中间件的**应用类型**上分 10 类：
数据访问中间件、远程过程调用中间件、交易中间件、**消息中间件**、对象中间件、应用服务器中间件、工作流中间件、门户中间件、安全中间件、企业应用集成中间件。

从中间件的通信实现机制上分 3 类：
远程过程调用（RPC）、利用消息进行通信、对象请求代理（ORB）。

14、消息是需要传递的数据。

15、消息分类：
1）按照参与者数量划分：点到点、发布/订阅；
2）按照传递方向：推、拉；
3）按照通信方式：同步、异步。

16、JMS （Java Message Service）是一组 Java 应用程序接口，它规定了创建、发送、接受、读取消息的一系列标准。

17、JMS 的应用的构成：
1）JMS 提供者
2）JMS 客户端
3）消息对象
4）管理对象

18、分布式对象技术是一种面向对象技术。作用是，将分布在网络上的资源按照对象的概念来组织。其有两方面内容：其一，分布式对象的标准规范；其二，对标准规范的实现。

19、OMG 的 CORBA 主要是对标准进行规定。
JavaRMI、JNDI、COM+ 既是标准也是实现。
WbeService 采用 XL 格式规定了一系列由 W3C 国际组织确认的标准规范。

20、CORBA（Common Object Request Broker Architecture）标准内容主要包括四个部分：对象模型、语言映射、互操作协议、对象服务。

21、CORBA 体系结构及对象模型主要由四部分组成：
ORB 内核、对象适配器、客户端存根（Syub）、服务器端骨架（Skeleton）组成。

22、ORB（Object request Broker）是一种能将客户端对象请求转化为服务端对象调用的机制。

23、微软的分布式对象技术经历了 COM、DCOM、MTS、COM+ 几个主要阶段。

24、Java 2 平台提供了两种方法来构造分布式应用系统：
Java RMI（Remote Method Invocation）
Java IDL（Interface Definition Language）

25、JNDI （Java Namig and Directory Interface）是为 Java 应用程序提供目录命令和命名服务功能的接口，负责对 Java 分布式对象进行管理和检索。

26、RMI 可以说是 Java 的 RPC 技术，即一个 JVM 内存空间对象可以获得另一个 JVM 内存空间对象的远程引用，并向其发送消息。

27、WebService 结构层次有四层：
发现服务——UDDI
服务描述——WSDL
服务调用——SOAP
传送协议——HTTP

28、WSDL（Web Services Description Language）是基于 XML 格式被 W3C 组织确认的标准协议，用于对 Web 服务接口和服务位置进行描述。

29、UDDI（Universal Description，Discovery and Integration）是一种独立于平台、基于 XML 格式、用于在互联网上描述 Web 服务的协议。

30、SOAP（Simple Object Access Protocol）是有微软、IBM 等公司发起由 W3C 组织确认的标准协议。它采用 XML 格式定义，可以将本地方法调用转为适合网络传输的形式（SOAP 请求），同时将 Web 服务经网络传输返回的调用结果转化为本地方法的返回值（SOAP 响应）。
